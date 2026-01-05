# Email Integration Setup Guide

## Overview
Fritz's Forge uses [Resend](https://resend.com) for transactional emails. This guide covers setup and testing.

---

## 1. Get Resend API Key

### Sign Up
1. Go to [resend.com](https://resend.com)
2. Create a free account
3. Free tier includes:
   - 100 emails/day
   - 3,000 emails/month
   - Perfect for testing and small-scale production

### Get API Key
1. Navigate to **API Keys** in dashboard
2. Click **Create API Key**
3. Name it: "Fritz's Forge Production"
4. Copy the key (starts with `re_`)

### Add to Environment
```bash
# .env.local
RESEND_API_KEY=re_your_actual_api_key_here
ADMIN_EMAIL=your-email@example.com
```

---

## 2. Domain Setup (Optional - For Production)

### Why Verify Domain?
- Emails from `orders@fritzforge.com` instead of `onboarding@resend.dev`
- Better deliverability
- Professional appearance
- Required for production use

### Steps
1. In Resend dashboard: **Domains** → **Add Domain**
2. Enter: `fritzforge.com` (or your actual domain)
3. Add DNS records to your domain provider:
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [provided by Resend]
   ```
4. Wait for verification (5-30 minutes)

### Update Email Code
Once verified, update sender in `/src/lib/email.ts`:
```typescript
from: 'Fritz\'s Forge <orders@fritzforge.com>'  // ✅ Custom domain
// Instead of:
from: 'Fritz\'s Forge <orders@resend.dev>'       // ❌ Default
```

---

## 3. Testing Emails

### Test with Development Email
```bash
# .env.local
RESEND_API_KEY=re_your_test_key
ADMIN_EMAIL=your-test-email@gmail.com
```

### Submit Test Order
1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/custom`
3. Fill out custom order form
4. Submit
5. Check your inbox (and spam folder)

### What You Should Receive

**Admin Email** (to ADMIN_EMAIL):
- Subject: "New Custom Order Request - From Scratch"
- Contains all order details
- Reply-to customer email

**Customer Email** (to form email):
- Subject: "Custom Order Request Received"
- Order confirmation with order ID
- Next steps explained

---

## 4. Email Templates

### Customizing Templates
Edit `/src/lib/email.ts`:

```typescript
// Change colors
.header { background: #0F0F10; color: #E8E5DB; }

// Add logo
<img src="https://yourcdn.com/logo.png" alt="Fritz's Forge" />

// Modify content
<p>Your custom message here</p>
```

### Dynamic Content
Available variables in admin email:
- `order.orderId` - Unique order reference
- `order.email` - Customer email
- `order.phone` - Customer phone (optional)
- `order.material` - Selected material
- `order.bladeWidth/Length` - Dimensions
- `order.modifications` - Modification requests
- `order.additionalNotes` - Custom notes

---

## 5. Production Deployment

### Vercel
```bash
# Add to Vercel project settings → Environment Variables
RESEND_API_KEY=re_your_production_key
ADMIN_EMAIL=orders@fritzforge.com
```

### Other Platforms (Netlify, Railway, etc.)
Same process - add env variables in platform settings

---

## 6. Troubleshooting

### Email Not Sending
```bash
# Check logs in terminal
# Look for: "Failed to send order email:"
```

**Common Issues**:
1. **Invalid API Key**: Double-check `.env.local`
2. **Rate Limit**: Free tier = 100/day, 3,000/month
3. **Spam**: Check customer spam folder
4. **Domain Not Verified**: Emails may be rejected

### Test Email Service
Create test endpoint: `/src/app/api/test-email/route.ts`
```typescript
import { Resend } from 'resend'

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  const { data, error } = await resend.emails.send({
    from: 'Test <onboarding@resend.dev>',
    to: process.env.ADMIN_EMAIL!,
    subject: 'Test Email',
    html: '<p>Email service is working!</p>',
  })

  return Response.json({ data, error })
}
```

Visit: `http://localhost:3000/api/test-email`

---

## 7. Monitoring

### Resend Dashboard
- **Emails**: View all sent emails
- **Logs**: See delivery status
- **Analytics**: Open rates, bounce rates
- **Webhooks**: Get notified of delivery events

### Enable Webhooks (Optional)
1. Resend dashboard → **Webhooks**
2. Add endpoint: `https://yoursite.com/api/webhooks/email`
3. Select events: `email.delivered`, `email.bounced`
4. Handle in your API route

---

## 8. Email Deliverability Tips

### Avoid Spam Folder
- Use verified domain
- Keep subject lines clear
- Include unsubscribe link (for marketing emails)
- Avoid spam trigger words: "FREE", "ACT NOW"
- Send consistently (don't send 1000 then nothing for months)

### HTML Best Practices
- Use inline CSS (external stylesheets don't work)
- Keep width < 600px
- Test in multiple clients (Gmail, Outlook, Apple Mail)
- Provide plain text fallback

---

## 9. Cost Scaling

### Resend Pricing
| Tier  | Price  | Emails/Month | Best For            |
| ----- | ------ | ------------ | ------------------- |
| Free  | $0     | 3,000        | Testing, low volume |
| Pro   | $20    | 50,000       | Small business      |
| Scale | Custom | 500,000+     | Enterprise          |

### Alternative: Nodemailer + SMTP
If you prefer self-hosted:
```bash
npm install nodemailer
```

Configure with Gmail SMTP:
```typescript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})
```

---

## 10. Quick Reference

### Environment Variables
```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
ADMIN_EMAIL=admin@fritzforge.com
```

### Test Commands
```bash
# Test custom order form
npm run dev
# Visit: http://localhost:3000/custom

# Check logs for email errors
# Terminal will show: "Failed to send order email:" or "Email sent successfully"
```

### Files Modified
- `/src/lib/email.ts` - Email templates and logic
- `/src/app/api/custom-order/route.ts` - Integrated email sending
- `.env.example` - Added RESEND_API_KEY and ADMIN_EMAIL

---

## Success Criteria

✅ **Setup Complete When:**
- [ ] Resend account created
- [ ] API key added to `.env.local`
- [ ] Test order sends both emails
- [ ] Admin receives order details
- [ ] Customer receives confirmation
- [ ] Emails not in spam folder

---

**Next Steps**: Test in production, monitor delivery rates, customize templates to match brand.
