package main

import (
	"context"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisWorkerConfig struct {
	Address  string
	Password string
	DB       int
	Queue    string
}

func StartRedisWorker(ctx context.Context, cfg RedisWorkerConfig) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     cfg.Address,
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	go func() {
		log.Printf("redis worker started, consuming from queue %q at %s", cfg.Queue, cfg.Address)

		for {
			select {
			case <-ctx.Done():
				log.Println("redis worker shutting down")
				rdb.Close()
				return
			default:
			}

			result, err := rdb.BLPop(ctx, 5*time.Second, cfg.Queue).Result()
			if err != nil {
				if err == redis.Nil || err == context.Canceled {
					continue
				}
				log.Printf("redis worker error: %v", err)
				time.Sleep(1 * time.Second)
				continue
			}

			if len(result) >= 2 {
				log.Printf("agent event: %s", result[1])
			}
		}
	}()
}
