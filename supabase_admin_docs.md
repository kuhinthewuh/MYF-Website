# Managing the Supabase Database & Admin Accounts

This document provides instructions for the Lead Developer (to invite directors) and the Directors (to manage accounts).

## Part 1: For the Lead Developer (Sharing the Dashboard)
To allow directors to manage the backend directly without coding, you need to invite them to your Supabase project.

1. Log in to [Supabase](https://supabase.com).
2. Select your project.
3. Click the **Settings** (gear icon) on the bottom left sidebar.
4. Go to **Access Management**.
5. Click **Invite Member**.
6. Enter the Director's email address and select the **Administrator** or **Developer** role depending on how much access you want them to have (Administrators can delete the project; Developers cannot).
7. Click send. They will receive an email invite to join your organization.

## Part 2: For Directors (Managing Site Admin Accounts)
Once the website is live, the Admin Portal requires an email and password to log in. You have full control over who gets access:

### How to Create a New Admin Portal Account
1. Log in to your [Supabase Dashboard](https://supabase.com).
2. Click on your project.
3. On the left sidebar, click **Authentication** (the two people icon).
4. Select **Users**.
5. Click the green **Add User** button in the top right corner, and select **Create new user**.
6. Enter an **Email Address** and a **Password** for the new administrator. 
7. *(Optional)* Turn off "Auto Confirm User" if you want them to verify their email, otherwise leave it on for instant access.
8. Click **Create User**.
9. The user can now navigate to the website's `/admin-portal/login` page and log in immediately using the credentials you just created.

### How to Remove/Revoke an Admin Account
1. Inside the **Authentication > Users** tab.
2. Find the user you wish to remove.
3. Click the three dots `...` on the far right of their row.
4. Select **Delete User** to permanently revoke their access, or **Suspend** if you just want to temporarily lock them out.

### Keeping the Database Awake
*The database automatically powers down if absolutely no one visits the site for 7 days. A Keep-Alive system has been built into the site, but it requires two pieces of information (URL and ANON KEY) to run. The lead developer will handle setting these up in GitHub to ensure the database runs 24/7.*
