# Codebase Cleanup Instructions

This document provides instructions on how to safely remove unused components from the codebase.

## Model Risk Management Components

If you're not using model risk management features, you can remove the following components:

### Backend Components

1. **API Endpoints**:
   - `backend/api/ml.py` - Contains ML model management endpoints

2. **Database Models**:
   - `backend/models/ml_model.py` - Contains ML model database schema
   - Database changes: You'll need to remove the related tables from the database

3. **Background Tasks**:
   - `backend/tasks/ml.py` - Contains ML background tasks

### Frontend Components

1. **UI Pages and Components**:
   - `frontend/src/app/models/page.tsx` - Model management UI
   - `frontend/src/app/risk/` directory - Risk management pages
   - `frontend/src/app/risk/monitoring/` - Model monitoring UI
   - `frontend/src/app/risk/assessment/` - Risk assessment UI

## Marketing Analytics Components

If you're not using marketing analytics features, you can remove the following components:

### Frontend Components

1. **UI Pages and Components**:
   - `frontend/src/app/campaigns/` directory - Campaign management UI
   - `frontend/src/app/campaigns/ai-plans/` - AI-driven marketing plans
   - `frontend/src/app/campaigns/view-edit-campaigns/` - Campaign editors
   - `frontend/src/app/campaigns/campaign-insights/` - Campaign analysis
   - `frontend/src/app/analytics/page.tsx` - Analytics dashboard

## How to Safely Remove Components

1. **Mark as Deprecated First**:
   - All the above files have been marked with `[DEPRECATED - CANDIDATE FOR REMOVAL]` comments
   - This allows testing the application without these components before fully removing them

2. **Update Blueprint Registration**:
   - When ready to remove, update `cli_app.py` to remove the imports and registrations for:
     - `ml_bp` (model risk management)
     - `campaigns_bp` (marketing campaigns)

3. **Database Cleanup**:
   - Before removing database models, create a migration to drop the tables:
     ```
     flask db migrate -m "remove ml_models table"
     flask db upgrade
     ```

4. **Frontend Route Cleanup**:
   - Update any navigation or menu components that reference these routes
   - Check for any references to these features in shared components

5. **Final Removal**:
   - Once confident that the application works without these components, delete the files
   - Remove any dependencies specific to these features

## Testing After Removal

After removing components, thoroughly test the application to ensure:

1. The application starts without errors
2. All remaining routes function properly
3. No references to removed components remain in the UI
4. Database operations work as expected 