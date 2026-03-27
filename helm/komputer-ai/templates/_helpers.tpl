{{/*
Common labels
*/}}
{{- define "komputer.labels" -}}
app.kubernetes.io/name: komputer
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end }}

{{/*
API internal URL (used by KomputerConfig and manager agents)
*/}}
{{- define "komputer.apiURL" -}}
{{- if .Values.config.apiURL -}}
{{ .Values.config.apiURL }}
{{- else -}}
http://{{ .Release.Name }}-api.{{ .Release.Namespace }}.svc.cluster.local:{{ .Values.api.service.port }}
{{- end -}}
{{- end }}

{{/*
Redis address
*/}}
{{/*
Redis fullname — delegates to the redis-ha subchart helper.
*/}}
{{- define "komputer.redis.fullname" -}}
{{- $redisHa := (index .Values "redis-ha") -}}
{{- $redisHaContext := dict "Chart" (dict "Name" "redis-ha") "Release" .Release "Values" $redisHa -}}
{{- if $redisHa.haproxy.enabled -}}
{{- printf "%s-haproxy" (include "redis-ha.fullname" $redisHaContext) | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- include "redis-ha.fullname" $redisHaContext -}}
{{- end -}}
{{- end }}

{{/*
Redis address — full service endpoint for KomputerConfig and API.
*/}}
{{- define "komputer.redisAddress" -}}
{{- if .Values.redis.enabled -}}
{{ include "komputer.redis.fullname" . }}.{{ .Release.Namespace }}.svc.cluster.local:6379
{{- else -}}
{{ .Values.externalRedis.address }}
{{- end -}}
{{- end }}
