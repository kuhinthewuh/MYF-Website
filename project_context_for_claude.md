# MYF Website - Project Context for Claude Code

## Overview
This document provides an in-depth overview of the Manteca Youth Focus (MYF) website project. It is built using **Next.js 14+ (App Router)** with **TypeScript**, styled via **Tailwind CSS**, and heavily relies on **Supabase** for database records and authentication.

## Architecture & Rendering Model
- **Public Site**: Standard App Router architecture (`app/about`, `app/competition`, etc.). Pages fetch content (such as text, layout information, and lists of winners) directly from a `site_content` table in Supabase.
- **Admin Portal (`app/admin-portal`)**: A protected backend for managing all website content in real-time. It uses a **custom multi-section UI** where everything lives on one "Dashboard" to allow seamless saving.

## Admin Portal Deep Dive (Crucial Context)
The Admin Portal (`app/admin-portal/page.tsx`) uses a unique rendering strategy:
1. **Persistent Mounting**: When a user clicks different sections in the sidebar (`AdminSidebar`), the corresponding admin configuration section (e.g., `AboutGlanceSection`, `HeroSection`) is rendered. **However**, instead of unmounting the old section, the parent `page.tsx` just toggles its container to `display: none`. This prevents massive data fetching lag and prevents unsaved changes from being lost when the user swaps tabs.
2. **Global Save Mechanism (`AdminSaveContext`)**: In `components/AdminSaveContext.tsx`, there is a context provider. When each section mounts, it calls `registerSaveAction('section-name', handleSave)` and passes its local `handleSave` function to the central pool.
3. The Dashboard header has a **"Save All Changes"** button which loops through every registered save action in sequence. 

## Recent Structural & UI/UX Adjustments (Where I Left Off)
1. **Dynamic Text Alignments**: The Admin UI now supports `text-left`, `text-center`, and `text-right` dynamic application on textareas across the `AboutGlanceSection.tsx`, `AboutBoardSection.tsx`, and `AboutHistorySection.tsx`. These states are now saved directly in JSON via the `align` properties on nodes.
2. **Stepper Sizing Adjustments**: Standard dashboard sections are contained in `max-w-4xl`. However, to better accommodate detailed Stepper Arrays in `ContestantFormsSection.tsx`, the master wrapper in `app/admin-portal/page.tsx` is now set to `max-w-5xl`.
3. **Link Routing Fixes**: Avoid using raw `<a>` tags in the Next.js `app` router unless the target is external, especially when inside an authorized context like the admin portal (it triggers hard reloads which can wipe transient Next.js auth states). We recently patched `app/admin-portal/privacy-policy/page.tsx` strictly to use `<Link>`. 
4. **Footer Animations**: In `GlobalFooter.tsx`, the hover translations (`hover:translate-x-1`) were moved onto inner `<span>` wrappers rather than the `<a>` or `<Link>` itself. This creates stable bounding boxes that prevent mouse 'jolt' disconnects.
5. **Accordion Jumps Fix**: In `ClientAccordions.tsx` (History of Excellence), we injected `style={{ overflowAnchor: 'none' }}` into the master layout wrapper.

## Goal for Claude Code
You are tasked with the final aesthetic implementations. Since the heavy functional logic, context routing, state-preservation, and database writes are working fully, your focus should be on:
- Utilizing existing Tailwind utilities for beautiful glassmorphism (`bg-white/5 backdrop-blur`), fluid hover states, and smooth gradients. 
- You can confidently edit individual front-end pages and know they are receiving data from the `/api/admin/content?id=section` route accurately.
- Never strip out the `registerSaveAction` hooks from admin sections!
- The system uses Lucide-React for standard icons across the App.
