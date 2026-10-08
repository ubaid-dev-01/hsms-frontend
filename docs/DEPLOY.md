# Deploy — hsms-frontend

## Vercel project
- Name: `hsms-frontend`
- GitHub: https://github.com/ubaid-dev-01/hsms-frontend

## CLI
```bash
cd hsms-frontend
vercel --prod --yes
```

## Pipeline
1. Native Git: `vercel git connect https://github.com/ubaid-dev-01/hsms-frontend.git`
2. GitHub Actions: set secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

