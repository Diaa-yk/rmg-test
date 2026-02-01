# RMG Test

A modern, high-performance Angular application for managing products and invoices. Built with a focus on clean architecture, scalability, and optimal user experience.

## Demo
[View Live Application](https://rmg-test-v1.vercel.app)

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher)
- Angular CLI (v19.0.0 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/Diaa-yk/rmg-test.git](https://github.com/Diaa-yk/rmg-test.git)

2. Navigate to the project folder:
    ```bash
    cd rmg-test

3. Install dependencies:
    ```bash
    npm install

Run Locally
    Execute the following command to start the development server:
    ```bash
    ng serve
    Open your browser and navigate to http://localhost:4200/.

🔐 Login Credentials (Simulated)
    To access the dashboard and management features, use the following credentials:

    Username: admin
    Password: 123456

🏗️ Architectural Decisions

1. Facade Pattern
We implemented the Facade Pattern (ProductFacade) to decouple the UI components from the core logic and state management. This ensures that components only interact with a simplified interface, making the code easier to test and maintain.

2. State Management with RxJS
Instead of heavy libraries, we used BehaviorSubjects within the Facade to manage the application state. This provides a reactive, "single source of truth" for product lists, loading states, and pagination.

3. Standalone Components & Lazy Loading
The application leverages Standalone Components to reduce boilerplate. We implemented Lazy Loading for all main routes to optimize the initial bundle size and improve load times.

🛠️ Libraries & Tools Used
Angular Material: Used for the UI components (Cards, Forms, Paginator, SnackBar).

RxJS: For reactive programming and stream management.

Angular Animations: To provide smooth transitions (Fade-in, List stagger animations).

✨ Additional Features Implemented
Advanced Caching Interceptor: A custom HTTP Interceptor that caches GET requests to improve performance and reduce API calls. It includes an automatic cache invalidation mechanism when data changes (Add/Update/Delete).

Reactive Search with Debounce: The search bar in the header uses debounceTime(300) and distinctUntilChanged to prevent redundant API calls while typing.

Global Notifications: A centralized NotificationService using MatSnackBar to provide real-time feedback for user actions.

Custom Form Validations: Centralized form logic using ProductFormGroup service to ensure data integrity.

Responsive Dashboard: A landing area with clear Calls-to-Action (CTA) for intuitive navigation.