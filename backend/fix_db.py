import asyncio
from sqlalchemy import text
from app.database import engine

async def fix_schema():
    print("Checking database schema...")
    async with engine.begin() as conn:
        try:
            # Check if description column exists
            result = await conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='projects' AND column_name='description'"))
            if not result.fetchone():
                print("Adding missing 'description' column to 'projects' table...")
                await conn.execute(text("ALTER TABLE projects ADD COLUMN description VARCHAR"))
                print("Column added successfully.")
            else:
                print("'description' column already exists.")
        except Exception as e:
            print(f"Error fixing schema: {e}")

if __name__ == "__main__":
    asyncio.run(fix_schema())
