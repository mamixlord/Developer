from dotenv import load_dotenv
load_dotenv()

import os
import bcrypt
import jwt
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Request, Response, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import aiofiles
import uuid

# JWT Configuration
JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

# Initialize FastAPI
app = FastAPI(title="Bilay Demir Dograma API")

# CORS
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")

# Allow all origins for development, specific origins for production
allowed_origins = [
    "http://localhost:3000",
    "https://5f290c58-0d84-4e32-8e41-86c11b8ac7f8.preview.emergentagent.com",
    "https://bilay-demir-dograma.preview.emergentagent.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
client = AsyncIOMotorClient(os.environ.get("MONGO_URL", "mongodb://localhost:27017"))
db = client[os.environ.get("DB_NAME", "bilay_demir_dograma")]

# Create uploads directory
UPLOAD_DIR = "/app/backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Pydantic Models
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str

class ServiceModel(BaseModel):
    title: str
    description: str
    icon: str
    image: Optional[str] = None
    order: int = 0

class ProjectModel(BaseModel):
    title: str
    description: str
    category: str
    images: List[str] = []
    featured: bool = False

class BlogPostModel(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: str
    image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    published: bool = False

class OfferRequestModel(BaseModel):
    name: str
    phone: str
    service: str
    width: Optional[str] = None
    height: Optional[str] = None
    message: Optional[str] = None

class ContactMessageModel(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class SiteSettingsModel(BaseModel):
    company_name: str
    phone: str
    email: str
    address: str
    whatsapp: str
    google_maps_embed: str
    about_text: str
    working_hours: str

class SEOSettingsModel(BaseModel):
    page_slug: str
    meta_title: str
    meta_description: str
    meta_keywords: str
    content: str

class TestimonialModel(BaseModel):
    name: str
    company: Optional[str] = None
    text: str
    rating: int = 5

# Auth Helper
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "role": user["role"]
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Email Helper
def send_email_notification(subject: str, body: str, to_email: str = None):
    gmail_user = os.environ.get("GMAIL_USER", "")
    gmail_password = os.environ.get("GMAIL_PASSWORD", "")
    
    if not gmail_user or not gmail_password:
        print(f"Email notification (GMAIL not configured): {subject}")
        return False
    
    try:
        msg = MIMEMultipart()
        msg['From'] = gmail_user
        msg['To'] = to_email or gmail_user
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

# Startup Event
@app.on_event("startup")
async def startup_event():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    await db.blog_posts.create_index("slug", unique=True)
    await db.seo_settings.create_index("page_slug", unique=True)
    
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@bilaydemir.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "BilayAdmin2024!")
    existing = await db.users.find_one({"email": admin_email})
    
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        })
        print(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        print(f"Admin password updated: {admin_email}")
    
    # Seed default site settings if not exists
    site_settings = await db.site_settings.find_one({})
    if not site_settings:
        await db.site_settings.insert_one({
            "company_name": "Bilay Demir Dograma",
            "phone": "+90 212 XXX XX XX",
            "email": "info@bilaydemir.com",
            "address": "Kagithane, Istanbul",
            "whatsapp": "+905XXXXXXXXX",
            "google_maps_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48173.29!2d28.97!3d41.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7e1c0c5c1c5%3A0x0!2sKagithane%2C%20Istanbul!5e0!3m2!1str!2str!4v1",
            "about_text": "Bilay Demir Dograma, 20 yillik tecrubesiyle metal islerinde uzman bir firmadir.",
            "working_hours": "Pazartesi - Cumartesi: 08:00 - 18:00"
        })
    
    # Seed default services if not exists
    services_count = await db.services.count_documents({})
    if services_count == 0:
        default_services = [
            {"title": "Demir Kapi", "description": "Guclu ve estetik demir kapilar", "icon": "door", "order": 1},
            {"title": "Bahce Citleri", "description": "Dayanikli bahce cit sistemleri", "icon": "fence", "order": 2},
            {"title": "CNC Kesim", "description": "Hassas CNC metal kesim hizmetleri", "icon": "scissors", "order": 3},
            {"title": "Ozel Metal Uretim", "description": "Istege gore ozel metal uretim", "icon": "cog", "order": 4},
            {"title": "Tente Sistemleri", "description": "Metal tente ve sundurma sistemleri", "icon": "sun", "order": 5},
            {"title": "Kaynak/Tamir", "description": "Profesyonel kaynak ve tamir hizmetleri", "icon": "wrench", "order": 6}
        ]
        await db.services.insert_many(default_services)
    
    # Seed default testimonials if not exists
    testimonials_count = await db.testimonials.count_documents({})
    if testimonials_count == 0:
        default_testimonials = [
            {"name": "Ahmet Yilmaz", "company": "Yilmaz Insaat", "text": "Muhteşem işçilik, zamanında teslimat.", "rating": 5},
            {"name": "Mehmet Demir", "company": "Demir Emlak", "text": "Kaliteli malzeme ve profesyonel hizmet.", "rating": 5},
            {"name": "Ayse Kaya", "text": "Bahce kapimiz harika oldu, tesekkurler!", "rating": 5}
        ]
        await db.testimonials.insert_many(default_testimonials)
    
    # Write test credentials
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"""# Test Credentials

## Admin User
- Email: {admin_email}
- Password: {admin_password}
- Role: admin

## Auth Endpoints
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/auth/refresh
""")

# Health Check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "bilay-demir-dograma-api"}

# ==================== AUTH ENDPOINTS ====================

@app.post("/api/auth/login")
async def login(credentials: UserLogin, response: Response, request: Request):
    email = credentials.email.lower()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    
    # Check brute force
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        lockout_time = attempts.get("last_attempt", datetime.now(timezone.utc))
        if datetime.now(timezone.utc) - lockout_time < timedelta(minutes=15):
            raise HTTPException(status_code=429, detail="Too many login attempts. Try again later.")
        else:
            await db.login_attempts.delete_one({"identifier": identifier})
    
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last_attempt": datetime.now(timezone.utc)}},
            upsert=True
        )
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    await db.login_attempts.delete_one({"identifier": identifier})
    
    access_token = create_access_token(str(user["_id"]), user["email"])
    refresh_token = create_refresh_token(str(user["_id"]))
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }

@app.post("/api/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out successfully"}

@app.get("/api/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

@app.post("/api/auth/refresh")
async def refresh_token(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")
    
    try:
        payload = jwt.decode(refresh_token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        access_token = create_access_token(str(user["_id"]), user["email"])
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
        
        return {"message": "Token refreshed"}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# ==================== PUBLIC ENDPOINTS ====================

@app.get("/api/services")
async def get_services():
    services = await db.services.find({}).sort("order", 1).to_list(100)
    return [{"id": str(s["_id"]), **{k: v for k, v in s.items() if k != "_id"}} for s in services]

@app.get("/api/projects")
async def get_projects(featured: bool = None):
    query = {}
    if featured is not None:
        query["featured"] = featured
    projects = await db.projects.find(query).sort("created_at", -1).to_list(100)
    return [{"id": str(p["_id"]), **{k: v for k, v in p.items() if k != "_id"}} for p in projects]

@app.get("/api/blog")
async def get_blog_posts(published_only: bool = True):
    query = {"published": True} if published_only else {}
    posts = await db.blog_posts.find(query).sort("created_at", -1).to_list(100)
    return [{"id": str(p["_id"]), **{k: v for k, v in p.items() if k != "_id"}} for p in posts]

@app.get("/api/blog/{slug}")
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"id": str(post["_id"]), **{k: v for k, v in post.items() if k != "_id"}}

@app.get("/api/testimonials")
async def get_testimonials():
    testimonials = await db.testimonials.find({}).to_list(100)
    return [{"id": str(t["_id"]), **{k: v for k, v in t.items() if k != "_id"}} for t in testimonials]

@app.get("/api/site-settings")
async def get_site_settings():
    settings = await db.site_settings.find_one({})
    if not settings:
        return {}
    return {k: v for k, v in settings.items() if k != "_id"}

@app.get("/api/seo/{page_slug}")
async def get_seo_settings(page_slug: str):
    seo = await db.seo_settings.find_one({"page_slug": page_slug})
    if not seo:
        return {}
    return {k: v for k, v in seo.items() if k != "_id"}

# ==================== CONTACT & OFFER ENDPOINTS ====================

@app.post("/api/offer-request")
async def create_offer_request(
    name: str = Form(...),
    phone: str = Form(...),
    service: str = Form(...),
    width: str = Form(None),
    height: str = Form(None),
    message: str = Form(None),
    image: UploadFile = File(None)
):
    image_path = None
    if image:
        ext = image.filename.split(".")[-1] if "." in image.filename else "jpg"
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        async with aiofiles.open(filepath, "wb") as f:
            content = await image.read()
            await f.write(content)
        image_path = f"/uploads/{filename}"
    
    offer = {
        "name": name,
        "phone": phone,
        "service": service,
        "width": width,
        "height": height,
        "message": message,
        "image": image_path,
        "status": "new",
        "created_at": datetime.now(timezone.utc)
    }
    result = await db.offer_requests.insert_one(offer)
    
    # Send email notification
    email_body = f"""
    <h2>Yeni Teklif Talebi</h2>
    <p><strong>Ad:</strong> {name}</p>
    <p><strong>Telefon:</strong> {phone}</p>
    <p><strong>Hizmet:</strong> {service}</p>
    <p><strong>Genislik:</strong> {width or 'Belirtilmedi'}</p>
    <p><strong>Yukseklik:</strong> {height or 'Belirtilmedi'}</p>
    <p><strong>Mesaj:</strong> {message or 'Yok'}</p>
    """
    send_email_notification("Yeni Teklif Talebi - Bilay Demir Dograma", email_body)
    
    return {"message": "Teklif talebiniz alindi", "id": str(result.inserted_id)}

@app.post("/api/contact")
async def create_contact_message(data: ContactMessageModel):
    contact = {
        **data.model_dump(),
        "status": "unread",
        "created_at": datetime.now(timezone.utc)
    }
    result = await db.contact_messages.insert_one(contact)
    
    # Send email notification
    email_body = f"""
    <h2>Yeni Iletisim Mesaji</h2>
    <p><strong>Ad:</strong> {data.name}</p>
    <p><strong>E-posta:</strong> {data.email}</p>
    <p><strong>Telefon:</strong> {data.phone or 'Belirtilmedi'}</p>
    <p><strong>Mesaj:</strong> {data.message}</p>
    """
    send_email_notification("Yeni Iletisim Mesaji - Bilay Demir Dograma", email_body)
    
    return {"message": "Mesajiniz alindi", "id": str(result.inserted_id)}

# ==================== ADMIN ENDPOINTS ====================

# Services Management
@app.post("/api/admin/services")
async def create_service(data: ServiceModel, request: Request):
    await get_current_user(request)
    service = {**data.model_dump(), "created_at": datetime.now(timezone.utc)}
    result = await db.services.insert_one(service)
    return {"id": str(result.inserted_id), **data.model_dump()}

@app.put("/api/admin/services/{service_id}")
async def update_service(service_id: str, data: ServiceModel, request: Request):
    await get_current_user(request)
    await db.services.update_one({"_id": ObjectId(service_id)}, {"$set": data.model_dump()})
    return {"id": service_id, **data.model_dump()}

@app.delete("/api/admin/services/{service_id}")
async def delete_service(service_id: str, request: Request):
    await get_current_user(request)
    await db.services.delete_one({"_id": ObjectId(service_id)})
    return {"message": "Service deleted"}

# Projects Management
@app.get("/api/admin/projects")
async def admin_get_projects(request: Request):
    await get_current_user(request)
    projects = await db.projects.find({}).sort("created_at", -1).to_list(100)
    return [{"id": str(p["_id"]), **{k: v for k, v in p.items() if k != "_id"}} for p in projects]

@app.post("/api/admin/projects")
async def create_project(data: ProjectModel, request: Request):
    await get_current_user(request)
    project = {**data.model_dump(), "created_at": datetime.now(timezone.utc)}
    result = await db.projects.insert_one(project)
    return {"id": str(result.inserted_id), **data.model_dump()}

@app.put("/api/admin/projects/{project_id}")
async def update_project(project_id: str, data: ProjectModel, request: Request):
    await get_current_user(request)
    await db.projects.update_one({"_id": ObjectId(project_id)}, {"$set": data.model_dump()})
    return {"id": project_id, **data.model_dump()}

@app.delete("/api/admin/projects/{project_id}")
async def delete_project(project_id: str, request: Request):
    await get_current_user(request)
    await db.projects.delete_one({"_id": ObjectId(project_id)})
    return {"message": "Project deleted"}

# Blog Management
@app.get("/api/admin/blog")
async def admin_get_blog_posts(request: Request):
    await get_current_user(request)
    posts = await db.blog_posts.find({}).sort("created_at", -1).to_list(100)
    return [{"id": str(p["_id"]), **{k: v for k, v in p.items() if k != "_id"}} for p in posts]

@app.post("/api/admin/blog")
async def create_blog_post(data: BlogPostModel, request: Request):
    await get_current_user(request)
    post = {**data.model_dump(), "created_at": datetime.now(timezone.utc)}
    result = await db.blog_posts.insert_one(post)
    return {"id": str(result.inserted_id), **data.model_dump()}

@app.put("/api/admin/blog/{post_id}")
async def update_blog_post(post_id: str, data: BlogPostModel, request: Request):
    await get_current_user(request)
    await db.blog_posts.update_one({"_id": ObjectId(post_id)}, {"$set": data.model_dump()})
    return {"id": post_id, **data.model_dump()}

@app.delete("/api/admin/blog/{post_id}")
async def delete_blog_post(post_id: str, request: Request):
    await get_current_user(request)
    await db.blog_posts.delete_one({"_id": ObjectId(post_id)})
    return {"message": "Blog post deleted"}

# Offer Requests Management
@app.get("/api/admin/offer-requests")
async def get_offer_requests(request: Request):
    await get_current_user(request)
    offers = await db.offer_requests.find({}).sort("created_at", -1).to_list(100)
    return [{"id": str(o["_id"]), **{k: v for k, v in o.items() if k != "_id"}} for o in offers]

@app.put("/api/admin/offer-requests/{offer_id}/status")
async def update_offer_status(offer_id: str, status: str, request: Request):
    await get_current_user(request)
    await db.offer_requests.update_one({"_id": ObjectId(offer_id)}, {"$set": {"status": status}})
    return {"message": "Status updated"}

@app.delete("/api/admin/offer-requests/{offer_id}")
async def delete_offer_request(offer_id: str, request: Request):
    await get_current_user(request)
    await db.offer_requests.delete_one({"_id": ObjectId(offer_id)})
    return {"message": "Offer request deleted"}

# Contact Messages Management
@app.get("/api/admin/contact-messages")
async def get_contact_messages(request: Request):
    await get_current_user(request)
    messages = await db.contact_messages.find({}).sort("created_at", -1).to_list(100)
    return [{"id": str(m["_id"]), **{k: v for k, v in m.items() if k != "_id"}} for m in messages]

@app.put("/api/admin/contact-messages/{message_id}/status")
async def update_message_status(message_id: str, status: str, request: Request):
    await get_current_user(request)
    await db.contact_messages.update_one({"_id": ObjectId(message_id)}, {"$set": {"status": status}})
    return {"message": "Status updated"}

@app.delete("/api/admin/contact-messages/{message_id}")
async def delete_contact_message(message_id: str, request: Request):
    await get_current_user(request)
    await db.contact_messages.delete_one({"_id": ObjectId(message_id)})
    return {"message": "Message deleted"}

# Site Settings Management
@app.put("/api/admin/site-settings")
async def update_site_settings(data: SiteSettingsModel, request: Request):
    await get_current_user(request)
    await db.site_settings.update_one({}, {"$set": data.model_dump()}, upsert=True)
    return data.model_dump()

# SEO Settings Management
@app.get("/api/admin/seo")
async def get_all_seo_settings(request: Request):
    await get_current_user(request)
    seo_list = await db.seo_settings.find({}).to_list(100)
    return [{"id": str(s["_id"]), **{k: v for k, v in s.items() if k != "_id"}} for s in seo_list]

@app.post("/api/admin/seo")
async def create_seo_settings(data: SEOSettingsModel, request: Request):
    await get_current_user(request)
    seo = {**data.model_dump(), "created_at": datetime.now(timezone.utc)}
    result = await db.seo_settings.insert_one(seo)
    return {"id": str(result.inserted_id), **data.model_dump()}

@app.put("/api/admin/seo/{seo_id}")
async def update_seo_settings(seo_id: str, data: SEOSettingsModel, request: Request):
    await get_current_user(request)
    await db.seo_settings.update_one({"_id": ObjectId(seo_id)}, {"$set": data.model_dump()})
    return {"id": seo_id, **data.model_dump()}

# Testimonials Management
@app.post("/api/admin/testimonials")
async def create_testimonial(data: TestimonialModel, request: Request):
    await get_current_user(request)
    testimonial = {**data.model_dump(), "created_at": datetime.now(timezone.utc)}
    result = await db.testimonials.insert_one(testimonial)
    return {"id": str(result.inserted_id), **data.model_dump()}

@app.put("/api/admin/testimonials/{testimonial_id}")
async def update_testimonial(testimonial_id: str, data: TestimonialModel, request: Request):
    await get_current_user(request)
    await db.testimonials.update_one({"_id": ObjectId(testimonial_id)}, {"$set": data.model_dump()})
    return {"id": testimonial_id, **data.model_dump()}

@app.delete("/api/admin/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, request: Request):
    await get_current_user(request)
    await db.testimonials.delete_one({"_id": ObjectId(testimonial_id)})
    return {"message": "Testimonial deleted"}

# File Upload
@app.post("/api/admin/upload")
async def upload_file(request: Request, file: UploadFile = File(...)):
    await get_current_user(request)
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    async with aiofiles.open(filepath, "wb") as f:
        content = await file.read()
        await f.write(content)
    
    return {"url": f"/uploads/{filename}"}

# Dashboard Stats
@app.get("/api/admin/stats")
async def get_dashboard_stats(request: Request):
    await get_current_user(request)
    
    offers_count = await db.offer_requests.count_documents({})
    new_offers = await db.offer_requests.count_documents({"status": "new"})
    messages_count = await db.contact_messages.count_documents({})
    unread_messages = await db.contact_messages.count_documents({"status": "unread"})
    projects_count = await db.projects.count_documents({})
    blog_count = await db.blog_posts.count_documents({})
    
    return {
        "offers": {"total": offers_count, "new": new_offers},
        "messages": {"total": messages_count, "unread": unread_messages},
        "projects": projects_count,
        "blog_posts": blog_count
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
