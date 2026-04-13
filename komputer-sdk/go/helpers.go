package sdk

// PtrString returns a pointer to the given string value.
func PtrString(v string) *string { return &v }

// PtrBool returns a pointer to the given bool value.
func PtrBool(v bool) *bool { return &v }

// PtrInt64 returns a pointer to the given int64 value.
func PtrInt64(v int64) *int64 { return &v }

// PtrFloat64 returns a pointer to the given float64 value.
func PtrFloat64(v float64) *float64 { return &v }
