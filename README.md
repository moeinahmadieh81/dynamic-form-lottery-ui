# Dynamic Form Lottery Frontend

React + TypeScript frontend for the Dynamic Form Lottery backend.

## Stack

- React 19 + TypeScript
- Vite
- Material UI
- TanStack Query
- React Router
- React Hook Form
- Axios
- dnd-kit (drag & drop form builder)

## Run

Backend should be available on `http://localhost:8080`.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Vite proxies `/api` to the backend, so CORS configuration is not required for local development.

## Admin Form Builder

Login with the local bootstrap admin and open **مدیریت → فرم جدید**.

The builder supports:

- Create a new dynamic form
- Edit DRAFT forms
- Drag & drop field ordering
- Duplicate/remove fields
- Live field settings
- TEXT, TEXTAREA, NUMBER, EMAIL, PHONE, DATE, DATETIME, SELECT, MULTI_SELECT, RADIO, CHECKBOX, BOOLEAN
- Text validation: minLength, maxLength, regex
- Number validation: min, max
- Option editing for select/radio/checkbox fields
- Live preview using the same `DynamicFormRenderer` used by end users
- Saving through `POST /api/forms`
- Editing through `PUT /api/forms/{id}`; each save creates a new backend form version

## Important behavior

A form can be fully edited only while its backend status is `DRAFT`. Once published, the builder disables saving.

The frontend validates keys/options and basic rules before saving, while the backend remains the source of truth for schema and submission validation.

## Auth

Development admin defaults (from backend bootstrap):

- `admin@local.dev`
- `ChangeMe123!`

Do not use these credentials in production.

## Admin lottery controls

The admin dashboard now supports the CLOSED -> READY -> COMPLETED lottery flow:

- CLOSED form with no lottery: choose winner count and create lottery.
- READY lottery: view participant/winner counts and run lottery.
- COMPLETED/DRAWN form: open lottery result.

The UI calls the existing backend endpoints:

- `POST /api/forms/{formId}/lotteries`
- `POST /api/lotteries/{lotteryId}/run`
- `GET /api/forms/{formId}/lottery`

## Admin form details (final frontend phase)

A dedicated admin page is available at:

```text
/admin/forms/:id
```

It includes:

- Form overview and schema field list
- Submission count and paginated participant table
- User/email/status/version/submission time
- Dialog for reviewing dynamic answers using the form schema labels/options
- Lottery status and snapshot statistics
- Create/run lottery controls for CLOSED forms
- Detailed winner table for completed lotteries
- Admin lifecycle actions (edit/publish/close) and link to the end-user form view

The Admin Dashboard `جزئیات` button now routes to this page.

## UI polish update

این نسخه یک Design System یکپارچه‌تر دارد:

- هدر شیشه‌ای (glass / blur) و navigation فعال
- Hero گرادیانی در صفحات اصلی
- کارت‌های hoverدار با سایه‌های نرم
- Login / Register دو ستونه و مدرن
- وضعیت‌های فرم با رنگ‌های متمایز
- دکمه بازگشت یکپارچه در صفحات داخلی
- صفحه نتیجه قرعه‌کشی با تاکید بصری روی برنده فعلی
- طراحی responsive برای موبایل و دسکتاپ

### Back navigation

صفحات داخلی مثل جزئیات فرم، نتیجه قرعه‌کشی، ثبت‌های من، Form Builder و جزئیات Admin دکمه بازگشت واضح دارند.
