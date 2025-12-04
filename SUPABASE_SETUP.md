# Supabase Setup Guide

This app uses Supabase for authentication and optional cloud data storage.

## Setup Steps

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: cashflow.pilot (or your preferred name)
   - Database Password: (create a strong password)
   - Region: (choose closest to your users)
5. Wait for the project to be created (~2 minutes)

### 2. Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 3. Configure Your App

1. Open the `.env` file in the root of your project
2. Replace the placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Enable Email Authentication

By default, Supabase requires email confirmation. For development, you can disable this:

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle **"Confirm email"** to OFF (for development only)
3. Click **Save**

For production, keep email confirmation enabled for security.

### 5. Create Database Tables (For Cloud Storage)

If you want to use cloud storage for your financial data:

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-migration.sql` from the project root
3. Paste and run the SQL script
4. This creates tables for: accounts, transactions, budgets, goals, and recurring_patterns
5. Row Level Security (RLS) is automatically enabled to protect user data

### 6. Restart Your Dev Server

After updating the `.env` file, restart your development server:

```bash
pnpm dev
```

## Features

The Supabase integration provides:

- ✅ Secure email/password authentication
- ✅ Session management with automatic token refresh
- ✅ Optional cloud storage for financial data
- ✅ Dual storage mode: Local Storage or Supabase
- ✅ Row Level Security for data protection
- ✅ Real-time sync across devices (when using Supabase mode)
- ✅ Password reset functionality (can be added)
- ✅ Email verification (optional)
- ✅ OAuth providers (Google, GitHub, etc. - can be added)

## Storage Modes

The app supports two storage modes:

### Local Storage (Default)
- All data stored in browser localStorage
- No internet connection required
- Data stays on your device
- Fast and private

### Supabase Cloud Storage
- Data stored in Supabase database
- Accessible from any device
- Automatic backup
- Requires authentication
- Switch in Settings → Cloud Sync

## User Data Storage

User profiles are stored in Supabase's auth system with:
- Email
- Name (stored in user_metadata)
- Created date
- Unique user ID

Financial data (when using Supabase mode):
- Accounts, Transactions, Budgets, Goals, Recurring Patterns
- Each record is linked to the user's ID
- Protected by Row Level Security policies

## Using Cloud Storage

1. Sign in to the app
2. Go to **Settings** → **Cloud Sync**
3. Click **"Switch to Supabase"** to enable cloud storage
4. Click **"Upload to Cloud"** to sync your local data
5. Your data is now stored in Supabase and accessible from any device

To restore data on another device:
1. Sign in with the same account
2. Switch to Supabase mode
3. Click **"Download from Cloud"**

## Next Steps (Optional)

### Add Password Reset

You can add password reset functionality using:
```typescript
await supabase.auth.resetPasswordForEmail(email);
```

### Add OAuth Providers

Enable Google, GitHub, or other OAuth providers in:
**Authentication** → **Providers** → Enable your preferred provider

## Troubleshooting

### "Invalid API key" error
- Check that your `.env` file has the correct credentials
- Make sure you've restarted the dev server after updating `.env`

### "Email not confirmed" error
- Disable email confirmation in Supabase settings (for development)
- Or check your email for the confirmation link

### Users can't sign up
- Check that email authentication is enabled in Supabase
- Verify your Supabase project is active

## Security Notes

- Never commit your `.env` file to version control
- The `.env.example` file is provided as a template
- Use environment variables for production deployments
- Enable email confirmation for production
- Set up proper Row Level Security policies
