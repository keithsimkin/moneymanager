# Supabase Authentication Setup Guide

This app now uses Supabase for authentication instead of localStorage.

## Setup Steps

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: MoneyManager (or your preferred name)
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

### 5. Restart Your Dev Server

After updating the `.env` file, restart your development server:

```bash
pnpm dev
```

## Features

The Supabase integration provides:

- ✅ Secure email/password authentication
- ✅ Session management with automatic token refresh
- ✅ Password reset functionality (can be added)
- ✅ Email verification (optional)
- ✅ OAuth providers (Google, GitHub, etc. - can be added)
- ✅ Row Level Security for data protection

## User Data Storage

User profiles are stored in Supabase's auth system with:
- Email
- Name (stored in user_metadata)
- Created date
- Unique user ID

## Next Steps (Optional)

### Add Password Reset

You can add password reset functionality using:
```typescript
await supabase.auth.resetPasswordForEmail(email);
```

### Add OAuth Providers

Enable Google, GitHub, or other OAuth providers in:
**Authentication** → **Providers** → Enable your preferred provider

### Secure Your Data

Set up Row Level Security (RLS) policies to ensure users can only access their own data.

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
