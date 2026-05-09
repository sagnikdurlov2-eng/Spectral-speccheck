/*
  # Create SpectraVision AI Inspection Schema

  1. New Tables
    - `reference_images`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, name of the reference image)
      - `image_url` (text, URL to stored image)
      - `image_type` (text, type: blueprint, mockup, design, photo)
      - `width` (integer, image width in pixels)
      - `height` (integer, image height in pixels)
      - `metadata` (jsonb, additional metadata)
      - `created_at` (timestamptz)

    - `inspections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `reference_image_id` (uuid, references reference_images)
      - `status` (text, status: running, completed, failed)
      - `alignment_score` (real, 0-1 alignment score)
      - `overall_score` (real, 0-1 overall quality score)
      - `defect_count` (integer, number of detected defects)
      - `calibration_data` (jsonb, perspective correction and calibration params)
      - `snapshot_url` (text, URL to captured snapshot)
      - `created_at` (timestamptz)
      - `completed_at` (timestamptz)

    - `defects`
      - `id` (uuid, primary key)
      - `inspection_id` (uuid, references inspections)
      - `defect_type` (text, type: alignment, missing_component, spacing, layout, color)
      - `severity` (text, severity: critical, warning, info)
      - `confidence` (real, 0-1 AI confidence score)
      - `x` (real, x position as percentage 0-100)
      - `y` (real, y position as percentage 0-100)
      - `width` (real, width as percentage 0-100)
      - `height` (real, height as percentage 0-100)
      - `description` (text, description of the defect)
      - `metadata` (jsonb, additional defect metadata)
      - `created_at` (timestamptz)

    - `inspection_reports`
      - `id` (uuid, primary key)
