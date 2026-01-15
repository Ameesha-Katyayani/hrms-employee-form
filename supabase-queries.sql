-- ============================================
-- SUPABASE SQL QUERIES FOR HRMS EMPLOYEE FORM
-- ============================================

-- 1. CREATE EMPLOYEES TABLE (Main table)
CREATE TABLE employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Personal Information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    alternate_email VARCHAR(255),
    date_of_birth DATE NOT NULL,
    marital_status VARCHAR(50) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    
    -- Contact Information
    phone VARCHAR(20) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    
    -- Current Address
    current_address TEXT NOT NULL,
    current_city VARCHAR(100) NOT NULL,
    current_state VARCHAR(100) NOT NULL,
    current_pincode VARCHAR(10) NOT NULL,
    
    -- Permanent Address
    permanent_address TEXT NOT NULL,
    permanent_city VARCHAR(100) NOT NULL,
    permanent_state VARCHAR(100) NOT NULL,
    permanent_pincode VARCHAR(10) NOT NULL,
    
    -- Family Information
    father_name VARCHAR(255) NOT NULL,
    mother_name VARCHAR(255) NOT NULL,
    spouse_name VARCHAR(255),
    number_of_children INTEGER DEFAULT 0,
    
    -- Guardian Information
    guardian_name VARCHAR(255) NOT NULL,
    guardian_relation VARCHAR(50) NOT NULL,
    guardian_phone VARCHAR(20) NOT NULL,
    guardian_address TEXT NOT NULL,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_relation VARCHAR(50) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    
    -- Bank Details
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    account_holder_name VARCHAR(255) NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    
    -- Identity Documents
    aadhaar_number VARCHAR(12) NOT NULL UNIQUE,
    aadhaar_card_url TEXT,
    pan_number VARCHAR(10) NOT NULL UNIQUE,
    pan_card_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. CREATE EDUCATION TABLE (One-to-Many relationship)
CREATE TABLE education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255) NOT NULL,
    year_of_passing INTEGER NOT NULL,
    grade VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. CREATE WORK EXPERIENCE TABLE (One-to-Many relationship)
CREATE TABLE work_experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    
    company_name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    salary VARCHAR(100) NOT NULL,
    
    -- Document URLs (stored in Supabase Storage)
    salary_slip_url TEXT,
    relieving_letter_url TEXT,
    experience_letter_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. CREATE INDEXES for better performance
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_aadhaar ON employees(aadhaar_number);
CREATE INDEX idx_employees_pan ON employees(pan_number);
CREATE INDEX idx_education_employee ON education(employee_id);
CREATE INDEX idx_work_experience_employee ON work_experience(employee_id);

-- 5. CREATE FUNCTION to update timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. CREATE TRIGGER for auto-updating timestamp
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;

-- 8. CREATE POLICIES (Adjust based on your authentication needs)
-- Allow authenticated users to insert
CREATE POLICY "Allow insert for authenticated users" ON employees
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow insert for authenticated users" ON education
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow insert for authenticated users" ON work_experience
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Allow users to read own data" ON employees
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow users to read own data" ON education
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow users to read own data" ON work_experience
    FOR SELECT TO authenticated
    USING (true);

-- Allow users to update their own data
CREATE POLICY "Allow users to update own data" ON employees
    FOR UPDATE TO authenticated
    USING (true);

-- 9. CREATE STORAGE BUCKET for documents
-- Run this in Supabase Storage UI or via API
-- Bucket name: 'employee-documents'

-- 10. SAMPLE QUERY: Insert employee with education and work experience
-- (Use this structure in your application)
/*
BEGIN;

-- Insert employee
INSERT INTO employees (
    name, email, alternate_email, date_of_birth, marital_status, blood_group,
    phone, mobile, alternate_phone,
    current_address, current_city, current_state, current_pincode,
    permanent_address, permanent_city, permanent_state, permanent_pincode,
    father_name, mother_name, spouse_name, number_of_children,
    guardian_name, guardian_relation, guardian_phone, guardian_address,
    emergency_contact_name, emergency_contact_relation, emergency_contact_phone,
    bank_name, account_number, ifsc_code, account_holder_name, branch_name,
    aadhaar_number, aadhaar_card_url, pan_number, pan_card_url
) VALUES (
    'John Doe', 'john@example.com', 'john.alt@example.com', '1990-01-01', 'Single', 'O+',
    '9876543210', '9876543211', '9876543212',
    '123 Main St', 'Mumbai', 'Maharashtra', '400001',
    '456 Home St', 'Pune', 'Maharashtra', '411001',
    'Father Name', 'Mother Name', NULL, 0,
    'Guardian Name', 'Father', '9876543213', 'Guardian Address',
    'Emergency Name', 'Parent', '9876543214',
    'HDFC Bank', '1234567890', 'HDFC0001234', 'John Doe', 'Mumbai Branch',
    '123456789012', 'url-to-aadhaar', 'ABCDE1234F', 'url-to-pan'
) RETURNING id;

-- Insert education (use the returned employee id)
INSERT INTO education (employee_id, degree, institution, field_of_study, year_of_passing, grade)
VALUES 
    ('employee-uuid-here', 'B.Tech', 'IIT Mumbai', 'Computer Science', 2012, '8.5 CGPA'),
    ('employee-uuid-here', 'M.Tech', 'IIT Delhi', 'Software Engineering', 2014, '9.0 CGPA');

-- Insert work experience (use the returned employee id)
INSERT INTO work_experience (
    employee_id, company_name, designation, from_date, to_date, salary,
    salary_slip_url, relieving_letter_url, experience_letter_url
)
VALUES 
    ('employee-uuid-here', 'Tech Corp', 'Software Engineer', '2014-06-01', '2018-05-31', '8,00,000',
     'url-to-salary-slip', 'url-to-relieving', 'url-to-experience'),
    ('employee-uuid-here', 'Big Tech', 'Senior Developer', '2018-06-01', '2022-12-31', '15,00,000',
     'url-to-salary-slip', 'url-to-relieving', 'url-to-experience');

COMMIT;
*/

-- 11. SAMPLE QUERY: Get complete employee details
/*
SELECT 
    e.*,
    json_agg(DISTINCT jsonb_build_object(
        'id', ed.id,
        'degree', ed.degree,
        'institution', ed.institution,
        'field_of_study', ed.field_of_study,
        'year_of_passing', ed.year_of_passing,
        'grade', ed.grade
    )) as education,
    json_agg(DISTINCT jsonb_build_object(
        'id', we.id,
        'company_name', we.company_name,
        'designation', we.designation,
        'from_date', we.from_date,
        'to_date', we.to_date,
        'salary', we.salary
    )) as work_experience
FROM employees e
LEFT JOIN education ed ON e.id = ed.employee_id
LEFT JOIN work_experience we ON e.id = we.employee_id
WHERE e.id = 'employee-uuid-here'
GROUP BY e.id;
*/
