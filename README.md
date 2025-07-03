# Mnemo Functions - Continuous Deployment Setup

This repository is configured for automatic deployment to Google Cloud Run whenever code is pushed to the `main` branch using GitHub Actions.

## 🚀 Continuous Deployment Status

✅ **Pipeline Status**: Active and configured
🔧 **Latest Update**: Fixed dependency and server configuration issues

## 🚀 Continuous Deployment

### GitHub Actions Workflow

The deployment workflow (`.github/workflows/deploy.yml`) automatically:

1. **Tests** - Runs on all pushes and PRs
2. **Builds** - Compiles TypeScript and builds Docker image  
3. **Deploys** - Deploys to Cloud Run (only on main branch pushes)

### Setup Instructions

To enable continuous deployment, you need to add the Google Cloud service account key to GitHub secrets:

#### 1. Add GitHub Secret

1. Go to your GitHub repository: `https://github.com/CJengineering/mnemo-functions`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GCP_SA_KEY`
5. Value: Paste the entire JSON content from your Google Cloud service account key
6. Click **Add secret**

#### 2. Test the Setup

Once the secret is added:

1. Push any change to the `main` branch
2. Go to **Actions** tab in your GitHub repository
3. Watch the deployment workflow run automatically
4. Your app will be deployed to Cloud Run

## 📋 API Endpoints

After deployment, your API will be available with these endpoints:

### Collection Items
- `POST /collection-items` - Create collection item
- `GET /collection-items` - Get all collection items (with optional filters)
- `GET /collection-items/:id` - Get collection item by ID
- `PUT /collection-items/:id` - Update collection item
- `DELETE /collection-items/:id` - Delete collection item
- `GET /collection-items/type/:type` - Get collection items by type

### Pages
- `POST /pages` - Create page
- `GET /pages` - Get all pages
- `GET /pages/:slug` - Get page by slug
- `PUT /pages/:slug` - Update page
- `DELETE /pages/:slug` - Delete page

### Data Chunks
- `POST /data-chunks` - Create data chunk
- `GET /data-chunks` - Get all data chunks
- `GET /data-chunks/:id` - Get data chunk by ID
- `PUT /data-chunks/:id` - Update data chunk
- `DELETE /data-chunks/:id` - Delete data chunk

### Other
- `GET /programmes` - Get all programmes

## 🚀 API Endpoints

### Collection Items

#### CRUD Operations

**CREATE Collection Item**
- **POST** `/api/collection-items`
- Transforms frontend form data using the mapper system and saves to PostgreSQL database
- **Body**: Incoming collection item data (see [Mapper Documentation](src/mappers/README.md))
- **Response**: Created collection item from database

**GET All Collection Items**
- **GET** `/api/collection-items`
- **Query Parameters**: 
  - `type` (optional): Filter by collection type (event, post, news, programme, source)
  - `status` (optional): Filter by status (active, inactive, archived)
- **Response**: Array of collection items

**GET Single Collection Item**
- **GET** `/api/collection-items/:id`
- **Parameters**: `id` - Collection item ID
- **Response**: Single collection item or 404 if not found

**GET Collection Items by Type**
- **GET** `/api/collection-items/type/:type`
- **Parameters**: `type` - Collection type (event, post, news, programme, source)
- **Response**: Array of collection items of specified type

**UPDATE Collection Item**
- **PUT** `/api/collection-items/:id`
- **Parameters**: `id` - Collection item ID
- **Body**: Fields to update (title, description, type, data, metaData, status)
- **Response**: Updated collection item

**DELETE Collection Item**
- **DELETE** `/api/collection-items/:id`
- **Parameters**: `id` - Collection item ID
- **Response**: Success message or 404 if not found

#### Example Usage

```bash
# Get all collection items
curl https://your-cloud-run-url/api/collection-items

# Get collection items filtered by type
curl "https://your-cloud-run-url/api/collection-items?type=event&status=active"

# Get a specific collection item
curl https://your-cloud-run-url/api/collection-items/123

# Get all events
curl https://your-cloud-run-url/api/collection-items/type/event

# Update a collection item
curl -X PUT https://your-cloud-run-url/api/collection-items/123 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "status": "inactive"}'

# Delete a collection item
curl -X DELETE https://your-cloud-run-url/api/collection-items/123
```

#### Demo Endpoint (Transformation Only)
- **POST** `/api/collection-items/demo`
- Demonstrates data transformation without database persistence
- **Body**: Same format as production endpoint
- **Response**: Shows original data, mapped data, and database format

```json
{
  "type": "event",
  "data": {
    "title": "Climate Innovation Summit",
    "slug": "climate-summit-2025",
    "status": "published",
    "eventDate": "2025-09-15",
    "city": "Dubai",
    "featured": true
  }
}
```

### Health Checks
- **GET** `/` - Basic health check
- **GET** `/health` - Detailed health status
- **GET** `/test` - Simple test endpoint

### AI-Powered Endpoints

#### Prompt-to-Collection Item (Production)
- **POST** `/api/prompt-to-item`
- Converts natural language prompts into structured collection items using AI
- Automatically saves to database upon successful processing
- **Body**:
```json
{
  "prompt": "Create a Climate Innovation Summit happening on September 15, 2025 in Dubai",
  "type": "event",
  "context": "This is a high-profile event for Community Jameel"
}
```
- **Success Response**: Created collection item with database ID
- **Error Response**: Lists missing required fields with suggestions

#### Prompt-to-Collection Item (Demo)
- **POST** `/api/prompt-to-item/demo`  
- Same functionality as production endpoint but doesn't save to database
- Perfect for testing and previewing AI transformations
- **Body**: Same format as production endpoint
- **Response**: Shows AI processing result without database persistence

#### How It Works:
1. 🤖 User submits natural language prompt
2. 🧠 AI determines collection type and extracts structured data
3. ✅ **Success**: All required fields found → Save to database
4. ❌ **Error**: Missing fields → Return suggestions for completion
5. 🔄 User can refine prompt and try again

#### Supported Collection Types:
- **Events** - Conferences, workshops, meetings, summits
- **Posts** - Blog articles, technical posts, announcements  
- **News** - News articles, press releases, updates
- **Programmes** - Research initiatives, projects, labs
- **Sources** - Publications, journals, media sources

## 🛠 Development

### Local Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Environment Setup:**
```bash
# Copy environment template
cp .env.template .env

# Edit .env and add your OpenAI API key
# Get your key from: https://platform.openai.com/api-keys
```

3. **Build and run:**
```bash
npm run build
npm start
```

### 🔐 Security & Secrets

For production deployment, secrets are managed via **Google Cloud Secret Manager**:

- **OpenAI API Key**: Stored securely in Secret Manager
- **Database Credentials**: Environment variables in Cloud Run
- **Local Development**: Use `.env` file (never commit this!)

See [`docs/SECRET_MANAGEMENT.md`](docs/SECRET_MANAGEMENT.md) for complete security setup.

## 🔧 Manual Deployment

If you need to deploy manually:

```bash
pnpm build
gcloud builds submit --config cloudbuild.yaml .
```

## 📝 Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Start locally
pnpm dev

# Run tests
pnpm test
```

## 🔐 Security Note

**Important**: Never commit service account keys or other sensitive credentials to your repository. Always use GitHub secrets or environment variables for sensitive information.
