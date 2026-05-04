# RentProof FastAPI Backend

## Overview
This is the FastAPI backend for the RentProof application. It serves all API endpoints for content, authentication, dashboard, and tenant portal functionality.

## Project Structure

```
backend/
├── main.py              # Main FastAPI application
├── models.py            # Pydantic models for type safety
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
├── routers/
│   ├── __init__.py
│   ├── content.py       # Landing page content endpoints
│   ├── auth.py          # Authentication endpoints
│   ├── dashboard.py     # Landlord dashboard endpoints
│   └── tenant.py        # Tenant portal endpoints
└── README.md            # This file
```

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Edit `.env` file with your configuration:
```
FRONTEND_URL=http://localhost:3000
DATABASE_URL=sqlite:///./rentproof.db
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### 4. Run the Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, view the interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Content Endpoints
- `GET /api/content/features` - Get all platform features
- `GET /api/content/pricing` - Get pricing plans
- `GET /api/content/testimonials` - Get testimonials
- `GET /api/content/stats` - Get platform stats

### Auth Endpoints
- `GET /api/auth/check` - Check authentication status
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Dashboard Endpoints
- `GET /api/dashboard/properties` - Get landlord properties
- `POST /api/dashboard/properties` - Create new property
- `GET /api/dashboard/rent-status` - Get rent collection status
- `GET /api/dashboard/maintenance` - Get maintenance requests
- `POST /api/dashboard/maintenance` - Create maintenance request
- `GET /api/dashboard/deposits` - Get deposit records
- `POST /api/dashboard/deposits` - Record deposit

### Tenant Endpoints
- `GET /api/tenant/portal` - Get tenant dashboard
- `POST /api/tenant/pay-rent` - Submit rent payment
- `POST /api/tenant/maintenance` - Submit maintenance request
- `GET /api/tenant/move-in-walkthrough` - Get walkthrough details
- `POST /api/tenant/move-in-walkthrough` - Submit walkthrough photos

## Key Features

### Content Management
- Dynamic features, pricing, testimonials, and stats
- Easy to update without code changes

### User Authentication
- Login and signup endpoints
- Session management (TODO: integrate with Firebase)
- Type-safe request/response validation

### Property Management
- Create and manage properties
- Track multiple units per property
- Associate tenants with units

### Rent Tracking
- Real-time rent collection status
- Unit-level payment tracking
- Monthly collection metrics

### Maintenance Management
- Submit and track maintenance requests
- Priority levels and status tracking
- Image attachments support

### Deposit Management
- Record and track security deposits
- Move-in/move-out tracking
- Legal deadline management

### Tenant Portal
- View rent due and payment status
- Submit rent payments online
- Report maintenance issues
- Complete move-in photo walkthrough

### Move-In Documentation
- Timestamped photo lockdown
- Cryptographic verification
- Dispute evidence export

## Testing

### Test with curl

```bash
# Get features
curl http://localhost:8000/api/content/features

# Get pricing
curl http://localhost:8000/api/content/pricing

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get rent status
curl http://localhost:8000/api/dashboard/rent-status

# Submit payment
curl -X POST http://localhost:8000/api/tenant/pay-rent \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"tenant123","unitId":"unit2a","amount":1950,"paymentMethod":"bank"}'
```

### Test with Python

```python
import httpx

async with httpx.AsyncClient() as client:
    # Get features
    response = await client.get("http://localhost:8000/api/content/features")
    print(response.json())
    
    # Login
    response = await client.post(
        "http://localhost:8000/api/auth/login",
        json={"email": "user@example.com", "password": "password123"}
    )
    print(response.json())
```

## Frontend Integration

The frontend (`lib/api.ts`) is configured to call these endpoints:

```typescript
import api from '@/lib/api'

// Get features
const features = await api.content.getFeatures()

// Login
const result = await api.auth.login(email, password)

// Get rent status
const rentStatus = await api.dashboard.getRentStatus()
```

## Implementation TODO

### Database Integration
- [ ] Connect to Firebase Firestore or PostgreSQL
- [ ] Replace mock data with real database queries
- [ ] Implement user-scoped data filtering
- [ ] Add data validation and integrity checks

### Authentication
- [ ] Integrate Firebase Authentication
- [ ] Implement JWT token generation and verification
- [ ] Add password hashing (bcrypt)
- [ ] Implement refresh token mechanism
- [ ] Add role-based access control (RBAC)

### Payment Processing
- [ ] Integrate Stripe or PayPal
- [ ] Implement payment verification
- [ ] Add payment history tracking
- [ ] Implement refund handling

### File Storage
- [ ] Connect Firebase Storage or AWS S3
- [ ] Implement image upload validation
- [ ] Add file size limits
- [ ] Implement image compression
- [ ] Add virus scanning

### Notifications
- [ ] Setup email service (SendGrid, Mailgun)
- [ ] Implement rent reminders
- [ ] Add payment confirmations
- [ ] Add maintenance notifications
- [ ] Implement SMS alerts (Twilio)

### Error Handling
- [ ] Add comprehensive error logging (Sentry)
- [ ] Implement request validation
- [ ] Add custom error responses
- [ ] Add error tracking and monitoring

### Security
- [ ] Implement rate limiting
- [ ] Add request validation (Pydantic/Zod)
- [ ] Add CSRF protection
- [ ] Implement input sanitization
- [ ] Add API key authentication

### Testing
- [ ] Unit tests for all endpoints
- [ ] Integration tests
- [ ] Load testing
- [ ] Security testing

### Performance
- [ ] Add caching (Redis)
- [ ] Implement database indexing
- [ ] Add query optimization
- [ ] Implement pagination
- [ ] Add background jobs (Celery)

### Monitoring
- [ ] Setup application monitoring
- [ ] Add performance metrics
- [ ] Implement uptime monitoring
- [ ] Add alert notifications

## Development Guidelines

### Adding New Endpoints

1. Define Pydantic models in `models.py`
2. Create router in appropriate `routers/` file
3. Use type hints for all parameters and returns
4. Include proper error handling with status codes
5. Add docstrings to explain endpoint purpose
6. Test with FastAPI interactive docs

### Code Style

- Follow PEP 8 style guide
- Use type hints for all functions
- Use descriptive variable names
- Add comments for complex logic
- Keep functions focused and small

### Best Practices

- Use FastAPI dependency injection for auth
- Leverage Pydantic for automatic validation
- Use async/await for I/O operations
- Return appropriate HTTP status codes
- Include meaningful error messages

## Deployment

### Local Development
```bash
python main.py
```

### Production with Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `DATABASE_URL` | Database connection URL | `sqlite:///./rentproof.db` |
| `SECRET_KEY` | Secret key for token signing | `your-secret-key` |
| `DEBUG` | Debug mode | `True` |

## Troubleshooting

### Port Already in Use
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9
```

### CORS Issues
- Check `FRONTEND_URL` in `.env`
- Ensure frontend origin is in `origins` list in `main.py`

### Import Errors
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`
- Check Python version (3.9+)

## Contributing

1. Create feature branch
2. Make changes following style guidelines
3. Add tests for new endpoints
4. Submit pull request

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
