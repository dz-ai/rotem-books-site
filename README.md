# Rotem Shemtov Children's Book Store

### This site was built for a friend to help her sell her children's books.

The site has two versions:
- **Live version**: Allows users to purchase books using their credit cards. [Visit here](https://www.rotems-books.store/)
- **Demo version**: A showcase for me as a developer. [Visit here](https://rotem-books-test-env.netlify.app/)

## Technical Aspects

### Frontend
The frontend is built with **React**, using **Vite** as a bundler, and is deployed on **Netlify**.  
It includes the full shopping experience, from product display and shopping cart to client details, shipping, and payment processing.  
Additionally, there is an **Admin Backoffice** for viewing and tracking orders.

Two React Contexts are used:
1. **Authentication & Preferences** – Handles admin authentication, language settings, and potentially themes in the future.
2. **Shopping Cart Management** – Manages the cart state throughout the user session.

Cookies are used to store some user preferences and necessary data for payment processing. Since the payment system is external and not part of the app's routing, cookies help retain relevant information for the payment success page.

For payment processing, I use the **Morning API**, an Israeli service that my friend already uses for her business. This API also provides order management capabilities, which I use in the Admin Backoffice.

### Backend
The backend is managed using **Netlify Functions**, which I found easy and convenient.  
It handles API connections (**Morning, Google**), manages authentication/authorization, and allows sending emails to the site owner.  
