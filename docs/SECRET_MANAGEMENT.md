# 🔐 Secret Management Guide

## Google Cloud Secret Manager Setup

### 1. Store OpenAI API Key in Secret Manager

```bash
# Create the secret
gcloud secrets create openai-api-key --data-file=<(echo "your_actual_api_key_here")

# Verify the secret was created
gcloud secrets list
```

### 2. Grant Cloud Run Access to Secrets

```bash
# Get the Cloud Run service account
export PROJECT_ID=cj-tech-381914
export SERVICE_ACCOUNT=$(gcloud run services describe mnemo-app --region=europe-west1 --format="value(spec.template.spec.serviceAccountName)")

# Grant access to the secret
gcloud secrets add-iam-policy-binding openai-api-key \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
```

### 3. Update Cloud Run Configuration

The `cloudbuild.yaml` already includes the secret configuration:

```yaml
--set-secrets=OPENAI_API_KEY=openai-api-key:latest
```

## Local Development

### 1. Setup Local Environment

```bash
# Copy the template
cp .env.template .env

# Edit .env and add your actual OpenAI API key
nano .env
```

### 2. Get OpenAI API Key

1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-proj-`)
4. Add it to your local `.env` file

## Security Best Practices

### ✅ DO:

- Store secrets in Google Cloud Secret Manager for production
- Use `.env.template` for documentation
- Keep `.env` in `.gitignore`
- Rotate API keys regularly
- Use least-privilege access for service accounts

### ❌ DON'T:

- Commit API keys to Git
- Share API keys in plain text
- Use the same key for multiple environments
- Store secrets in environment variables for production

## Managing Secrets

### Update a Secret

```bash
# Update existing secret
echo "new_api_key_here" | gcloud secrets versions add openai-api-key --data-file=-
```

### View Secret Versions

```bash
# List all versions
gcloud secrets versions list openai-api-key

# Access latest version
gcloud secrets versions access latest --secret="openai-api-key"
```

### Delete a Secret

```bash
# Delete the secret (use with caution!)
gcloud secrets delete openai-api-key
```

## Troubleshooting

### Cloud Run Can't Access Secret

1. Check service account permissions
2. Verify secret exists: `gcloud secrets list`
3. Check Cloud Run logs: `gcloud logging read "resource.type=cloud_run_revision"`

### Local Development Issues

1. Verify `.env` file exists and has correct key
2. Check key format (should start with `sk-proj-`)
3. Test key with OpenAI API directly

## Environment Variables in Cloud Run

### Current Configuration:

- `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Database credentials
- `INSTANCE_CONNECTION_NAME`: Cloud SQL connection
- `OPENAI_API_KEY`: Loaded from Secret Manager
- `NODE_ENV`: Set to `production` automatically

### View Current Environment:

```bash
gcloud run services describe mnemo-app --region=europe-west1 --format="value(spec.template.spec.template.spec.containers[0].env[].name,spec.template.spec.template.spec.containers[0].env[].value)"
```
