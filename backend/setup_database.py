#!/usr/bin/env python3
"""
Database setup script for Mentora
Run this to create the required tables in Supabase
"""

from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY')

def setup_database():
    """Create database tables if they don't exist"""
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Supabase credentials not found in .env file")
        return False
    
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Connected to Supabase")
        
        # Test connection by trying to query users table
        # If it doesn't exist, we'll get an error and need to create tables manually
        try:
            result = supabase.table('users').select('count').execute()
            print("✅ Database tables already exist")
            return True
        except Exception as e:
            print(f"⚠️ Tables don't exist yet: {e}")
            print("\n📋 Please run the following SQL in your Supabase SQL editor:")
            print("=" * 60)
            
            with open('database_schema.sql', 'r') as f:
                print(f.read())
            
            print("=" * 60)
            print("\n🔗 Go to: https://supabase.com/dashboard/project/yxrkbukobfkfvwtnqsgu/sql")
            print("📝 Copy and paste the SQL above, then run it")
            return False
            
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Setting up Mentora database...")
    setup_database()