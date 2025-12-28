# SSL/HTTPS Setup Guide

This guide will help you set up a free SSL certificate from Let's Encrypt for your PackPlanet application.

## Prerequisites

- VPS with Ubuntu
- Domain name pointing to your VPS IP address
- SSH access to VPS
- Application already deployed and running

## Step 1: Point Your Domain to VPS

Before starting, ensure your domain DNS is configured:

1. Go to your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare)
2. Add an **A record** pointing to your VPS IP:
   ```
   Type: A
   Name: @ (or your subdomain)
   Value: YOUR_VPS_IP
   TTL: 300 (or automatic)
   ```

3. Wait for DNS propagation (can take 5-60 minutes)
4. Verify with: `ping your-domain.com` - should show your VPS IP

## Step 2: Install Certbot on VPS

SSH into your VPS and install Certbot:

```bash
# Update package list
sudo apt update

# Install Certbot
sudo apt install certbot -y

# Verify installation
certbot --version
```

## Step 3: Prepare for Certificate Issuance

Create the directory for Let's Encrypt verification:

```bash
# Create webroot directory for ACME challenge
sudo mkdir -p /var/www/certbot

# Set permissions
sudo chmod -R 755 /var/www/certbot
```

## Step 4: Update Nginx Configuration

On your VPS, update the nginx configuration to use your domain name:

```bash
cd /opt/packplanet

# Edit nginx.conf
nano nginx/nginx.conf
```

Replace `DOMAIN` with your actual domain name in TWO places:

```nginx
# Line ~68-69
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

Also update `server_name _;` to `server_name your-domain.com;` in BOTH server blocks (HTTP and HTTPS).

**Example:**
```nginx
# HTTP server
server {
    listen 80;
    server_name packplanet.com;  # Change this
    ...
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name packplanet.com;  # Change this

    ssl_certificate /etc/letsencrypt/live/packplanet.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/packplanet.com/privkey.pem;
    ...
}
```

Save and exit (Ctrl+O, Enter, Ctrl+X).

## Step 5: Temporarily Stop Nginx

We need to stop nginx temporarily so Certbot can use port 80:

```bash
cd /opt/packplanet
docker compose stop nginx
```

## Step 6: Obtain SSL Certificate

Run Certbot in standalone mode to get the certificate:

```bash
sudo certbot certonly --standalone \
  -d your-domain.com \
  --non-interactive \
  --agree-tos \
  --email your-email@example.com
```

Replace:
- `your-domain.com` with your actual domain
- `your-email@example.com` with your email address

If you have multiple domains/subdomains, add them:
```bash
sudo certbot certonly --standalone \
  -d your-domain.com \
  -d www.your-domain.com \
  --non-interactive \
  --agree-tos \
  --email your-email@example.com
```

You should see:
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/your-domain.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/your-domain.com/privkey.pem
```

## Step 7: Verify Certificate Files

Check that the certificates were created:

```bash
sudo ls -la /etc/letsencrypt/live/your-domain.com/
```

You should see:
- `fullchain.pem`
- `privkey.pem`
- `cert.pem`
- `chain.pem`

## Step 8: Restart Nginx with SSL

```bash
cd /opt/packplanet

# Restart nginx with new configuration
docker compose up -d nginx

# Check nginx logs
docker compose logs nginx
```

If there are errors, check:
```bash
# Test nginx configuration
docker compose exec nginx nginx -t
```

## Step 9: Update Firewall

Allow HTTPS traffic through the firewall:

```bash
# Allow HTTPS (port 443)
sudo ufw allow 443/tcp

# Verify firewall rules
sudo ufw status
```

You should see:
```
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

## Step 10: Test HTTPS

Visit your domain with HTTPS:

```
https://your-domain.com
```

You should see:
- 🔒 Padlock icon in browser
- Certificate is valid
- Automatic redirect from HTTP to HTTPS

Test HTTP redirect:
```
http://your-domain.com
```

Should automatically redirect to `https://your-domain.com`

## Step 11: Set Up Auto-Renewal

Let's Encrypt certificates expire after 90 days. Set up automatic renewal:

```bash
# Test renewal process (dry run)
sudo certbot renew --dry-run
```

If successful, create a cron job for auto-renewal:

```bash
# Open crontab
sudo crontab -e

# Add this line (runs twice daily at 2:30 AM and 2:30 PM)
30 2,14 * * * certbot renew --quiet --post-hook "docker restart packplanet-nginx"
```

This will:
- Check for expiring certificates twice daily
- Renew if needed (within 30 days of expiration)
- Restart nginx container after renewal

## Troubleshooting

### Error: "Connection refused" or "Port already in use"

Make sure nginx container is stopped before running certbot:
```bash
docker compose stop nginx
```

### Error: "Domain verification failed"

Check that:
1. DNS is pointing to your VPS IP: `ping your-domain.com`
2. Port 80 is accessible: `curl -I http://your-domain.com`
3. Firewall allows port 80: `sudo ufw status`

### Error: "Certificate not found" after obtaining

Check nginx.conf has correct domain name in certificate paths:
```bash
grep -n "ssl_certificate" nginx/nginx.conf
```

### Nginx fails to start after enabling SSL

Check nginx configuration:
```bash
docker compose exec nginx nginx -t
```

Check logs:
```bash
docker compose logs nginx
```

Common issues:
- Wrong domain name in nginx.conf
- Certificate files don't exist at specified path
- Permissions issue with /etc/letsencrypt

### Force certificate renewal

If you need to renew immediately:
```bash
sudo certbot renew --force-renewal
docker compose restart nginx
```

## Verify SSL Configuration

Check your SSL configuration quality:

1. Visit: https://www.ssllabs.com/ssltest/
2. Enter your domain
3. Wait for analysis
4. You should get an **A** or **A+** rating

## Certificate Locations

- Certificates: `/etc/letsencrypt/live/your-domain.com/`
- Certbot logs: `/var/log/letsencrypt/`
- Renewal config: `/etc/letsencrypt/renewal/your-domain.com.conf`

## Summary

✅ Your application is now secured with HTTPS!

**What was configured:**
- Let's Encrypt SSL certificate (free, valid for 90 days)
- Automatic HTTP → HTTPS redirect
- Secure TLS 1.2 and 1.3 protocols
- HSTS security header
- Auto-renewal via cron job

**Security features enabled:**
- 🔒 Encrypted connections (TLS 1.2/1.3)
- 🔐 Strong cipher suites
- 🛡️ HSTS (HTTP Strict Transport Security)
- 🔄 Automatic renewal before expiration

**URLs:**
- HTTP: `http://your-domain.com` → redirects to HTTPS
- HTTPS: `https://your-domain.com` ✅
- Admin: `https://your-domain.com/admin/login` ✅

## Renewal Schedule

Certificates expire after 90 days. The cron job will automatically:
- Check twice daily (2:30 AM and 2:30 PM)
- Renew if within 30 days of expiration
- Restart nginx to apply new certificates

You can check renewal status anytime:
```bash
sudo certbot certificates
```

## Next Steps

After SSL is working:

1. Update your application settings if needed (no code changes required)
2. Test all functionality over HTTPS
3. Monitor the first auto-renewal (happens ~60 days after issuance)
4. Consider adding www subdomain if desired
