# Contact Form Email Setup Instructions

## ✅ What I've Done:

1. **Updated the contact form** to work properly with Netlify Forms
2. **Created a success page** (`success.html`) for better UX
3. **Added `netlify.toml`** configuration file
4. **Fixed form submission** to prevent default and handle responses correctly

## 📧 How to Receive Emails at normanmukama11@gmail.com

### Step 1: Deploy to Netlify

1. **Push your code to GitHub** (if not already done):

   ```bash
   git add .
   git commit -m "Add Netlify form with email notifications"
   git push origin main
   ```

2. **Deploy to Netlify**:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Deploy!

### Step 2: Configure Email Notifications in Netlify

Once deployed, configure email notifications:

1. **Go to your Netlify dashboard**
2. **Navigate to**: Site → Forms → Form notifications
3. **Click "Add notification"**
4. **Select "Email notification"**
5. **Enter your email**: `normanmukama11@gmail.com`
6. **Select the form**: `contact`
7. **Save**

### Step 3: Verify Form Submissions

1. **Check Netlify Form Submissions**:

   - Site → Forms → Active forms
   - Click on "contact" to see all submissions

2. **Test the form**:
   - Visit your live site
   - Fill out the contact form
   - Submit
   - Check your email at `normanmukama11@gmail.com`

## 📋 Alternative: Email Notification Settings

### Option 1: Netlify Dashboard (Recommended)

- **Dashboard → Forms → Form notifications → Add notification**
- Choose "Email notification"
- Enter: `normanmukama11@gmail.com`

### Option 2: Form Settings in Netlify

- Go to **Site settings → Forms**
- Under "Form notifications", add email notification
- You can also add Slack, webhook, or other integrations

## 🔔 What Happens When Someone Submits the Form:

1. ✅ Form data is captured by Netlify
2. ✅ You receive an email at `normanmukama11@gmail.com`
3. ✅ User sees the success page
4. ✅ Form submission is stored in Netlify dashboard

## 📧 Email Notification Example

You'll receive emails like this:

```
Subject: New form submission from Portfolio Contact Form

Name: John Doe
Email: john@example.com
Subject: Project Inquiry
Message: Hi Norman, I'd like to discuss a project...

View this submission: [Link to Netlify Dashboard]
```

## 🚨 Important Notes:

1. **Forms only work on deployed sites** (not localhost)
2. **Netlify's free plan** includes 100 form submissions/month
3. **Check spam folder** initially for Netlify emails
4. **Add Netlify to contacts** to ensure emails arrive in inbox

## 🎉 You're All Set!

Once you deploy to Netlify and configure notifications, you'll receive all form submissions directly to `normanmukama11@gmail.com`.

## 🆘 Troubleshooting

**Not receiving emails?**

- Check Netlify Dashboard → Forms to confirm submissions are being captured
- Verify email notification is configured in Netlify
- Check spam/junk folder
- Ensure form has `data-netlify="true"` attribute (✅ already added)

**Form not submitting?**

- Make sure you're testing on the deployed site (not localhost)
- Check browser console for errors
- Verify form has `name="contact"` attribute (✅ already added)

## 📞 Need Help?

Contact Netlify Support or check their [Forms documentation](https://docs.netlify.com/forms/setup/).
