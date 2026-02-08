import asyncio
import os
import sys
import traceback
from sqlalchemy import select
sys.path.append(os.getcwd())
from app.database import SessionLocal, engine
from app.models import User, UserRole
from app.auth.utils import get_password_hash

async def test_register():
    email = "test_reg_77@example.com"
    password = "password123"
    print(f"Testing registration for {email}")
    try:
        async with SessionLocal() as session:
            # Check if exists
            result = await session.execute(select(User).where(User.email == email))
            if result.scalars().first():
                print("User already exists, deleting for test...")
                # ... delete logic or just use a different email
                email = f"test_reg_{os.urandom(4).hex()}@example.com"
            
            db_user = User(
                email=email,
                hashed_password=get_password_hash(password),
                full_name="Test User",
                role=UserRole.MEMBER
            )
            session.add(db_user)
            await session.commit()
            print(f"Successfully registered {email}")
    except Exception as e:
        print(f"Registration failed: {e}")
        traceback.print_exc()
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_register())
