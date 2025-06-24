# Manga Trading Platform - Backend API

A comprehensive ASP.NET Core Web API for a manga trading and exchange platform called "トカエル" (Tocaeru).

## Overview

This backend service powers a marketplace where users can buy, sell, and exchange manga collections. The platform facilitates secure transactions between manga collectors with features like identity verification, messaging, and comprehensive listing management.

## Key Features

### User Management
- JWT-based authentication and authorization
- Identity verification with ID document upload
- User profiles with nickname and contact information
- Account management (email/password changes, account deletion)

### Marketplace Functionality
- **Sell Listings**: Create detailed manga sale listings with images, condition, pricing
- **Want Lists**: Users can create wish lists for desired manga
- **Owned Lists**: Track personal manga collections
- **Exchange Requests**: Request trades or purchases from other users
- **Matching System**: Automatically match buyers and sellers

### Communication & Safety
- **Messaging System**: In-app replies and notifications
- **Reporting System**: Report inappropriate content or users
- **User Blocking**: Block problematic users
- **Contact System**: Customer support messaging

### Infrastructure & Services
- **Image Management**: AWS S3 integration for manga photos
- **Email Notifications**: Amazon SES for transactional emails
- **Database**: Entity Framework Core with SQL Server
- **Security**: reCAPTCHA integration, secure password handling

## Technical Stack

- **Framework**: ASP.NET Core 6.0+
- **Database**: Entity Framework Core with SQL Server
- **Authentication**: ASP.NET Core Identity with JWT
- **Cloud Services**: 
  - AWS S3 (image storage)
  - AWS SES (email delivery)
  - AWS Secrets Manager (configuration)
- **Additional**: reCAPTCHA, Japanese text utilities

## API Controllers

- **UsersController**: User registration, authentication, profile management
- **SellsController**: Manga listing creation and management
- **RequestsController**: Purchase/exchange request handling
- **WishListsController**: Want list management
- **OwnedListsController**: Personal collection tracking
- **MyListsController**: User's listing overview
- **RepliesController**: Messaging between users
- **NotificationsController**: User notification management
- **ReportsController**: Content/user reporting
- **ContactsController**: Customer support messaging
- **BlockedUsersController**: User blocking functionality

## Database Models

Key entities include User accounts, Sell listings, Requests, WishLists, OwnedLists, Messages/Replies, Notifications, Reports, and image attachments with comprehensive relationships for a full marketplace experience.

## Security Features

- JWT token authentication
- Identity document verification
- Input validation and sanitization
- Rate limiting through reCAPTCHA
- Secure file upload handling
- AWS Secrets Manager for sensitive configuration

## Deployment

The application is configured for cloud deployment with AWS services integration and supports both development and production environments through configuration management.