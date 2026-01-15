import { useState } from "react";
import { supabase, uploadFile } from "../lib/supabase";
import "./EmployeeForm.css";

export default function EmployeeForm() {
  const [form, setForm] = useState({
    // Personal Information
    name: "",
    email: "",
    alternateEmail: "",
    dateOfBirth: "",
    maritalStatus: "",
    bloodGroup: "",
    
    // Contact Information
    phone: "",
    mobile: "",
    alternatePhone: "",
    
    // Current Address
    currentAddress: "",
    currentCity: "",
    currentState: "",
    currentPincode: "",
    
    // Permanent Address
    permanentAddress: "",
    permanentCity: "",
    permanentState: "",
    permanentPincode: "",
    
    // Family Information
    fatherName: "",
    motherName: "",
    spouseName: "",
    numberOfChildren: "",
    
    // Guardian Information
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    guardianAddress: "",
    
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    
    // Bank Details
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    branchName: "",
    
    // 10th Education
    tenth_board: "",
    tenth_school: "",
    tenth_year: "",
    tenth_percentage: "",
    
    // 12th Education
    twelfth_board: "",
    twelfth_school: "",
    twelfth_year: "",
    twelfth_percentage: "",
    
    // Aadhaar Details
    aadhaarNumber: "",
    
    // PAN Details
    panNumber: "",
    
    // Katyayani Letter
    hasKatyayaniLetter: "",
  });

  const [documents, setDocuments] = useState({
    aadhaarCard: null,
    panCard: null,
    bankProof: null,
    tenthMarksheet: null,
    twelfthMarksheet: null,
    katyayaniLetter: null,
  });

  const [educationList, setEducationList] = useState([
    {
      id: 1,
      degree: "",
      institution: "",
      fieldOfStudy: "",
      yearOfPassing: "",
      grade: "",
      certificate: null,
    },
  ]);

  const [workExperienceList, setWorkExperienceList] = useState([
    {
      id: 1,
      companyName: "",
      designation: "",
      fromDate: "",
      toDate: "",
      salary: "",
      salarySlip: null,
      relievingLetter: null,
      experienceLetter: null,
    },
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDocumentChange = (field, file) => {
    setDocuments({ ...documents, [field]: file });
  };

    const handleEducationChange = (id, field, value) => {
    setEducationList(
      educationList.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const addEducation = () => {
    const newId = Math.max(...educationList.map((e) => e.id), 0) + 1;
    setEducationList([
      ...educationList,
      {
        id: newId,
        degree: "",
        institution: "",
        fieldOfStudy: "",
        yearOfPassing: "",
        grade: "",
        certificate: null,
      },
    ]);
  };

  const removeEducation = (id) => {
    if (educationList.length > 1) {
      setEducationList(educationList.filter((edu) => edu.id !== id));
    }
  };

const handleWorkExperienceChange = (id, field, value) => {
  setWorkExperienceList(
    workExperienceList.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    )
  );
};

  const handleFileChange = (id, field, file) => {
    setWorkExperienceList(
      workExperienceList.map((exp) =>
        exp.id === id ? { ...exp, [field]: file } : exp
      )
    );
  };

  const addWorkExperience = () => {
    const newId = Math.max(...workExperienceList.map((e) => e.id), 0) + 1;
    setWorkExperienceList([
      ...workExperienceList,
      {
        id: newId,
        companyName: "",
        designation: "",
        fromDate: "",
        toDate: "",
        salary: "",
        salarySlip: null,
        relievingLetter: null,
        experienceLetter: null,
      },
    ]);
  };

  const removeWorkExperience = (id) => {
    if (workExperienceList.length > 1) {
      setWorkExperienceList(workExperienceList.filter((exp) => exp.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Show loading state
      alert("Submitting form... Please wait.");

      // 1. Upload Aadhaar card
      let aadhaarCardUrl = null;
      if (documents.aadhaarCard) {
        const aadhaarPath = `aadhaar/${Date.now()}_${documents.aadhaarCard.name}`;
        aadhaarCardUrl = await uploadFile(documents.aadhaarCard, 'employee-documents', aadhaarPath);
      }

      // 2. Upload PAN card
      let panCardUrl = null;
      if (documents.panCard) {
        const panPath = `pan/${Date.now()}_${documents.panCard.name}`;
        panCardUrl = await uploadFile(documents.panCard, 'employee-documents', panPath);
      }

      // 3. Upload Bank Proof
      let bankProofUrl = null;
      if (documents.bankProof) {
        const bankPath = `bank-proof/${Date.now()}_${documents.bankProof.name}`;
        bankProofUrl = await uploadFile(documents.bankProof, 'employee-documents', bankPath);
      }

      // 4. Upload 10th Marksheet
      let tenthMarksheetUrl = null;
      if (documents.tenthMarksheet) {
        const tenthPath = `10th-marksheets/${Date.now()}_${documents.tenthMarksheet.name}`;
        tenthMarksheetUrl = await uploadFile(documents.tenthMarksheet, 'employee-documents', tenthPath);
      }

      // 5. Upload 12th Marksheet
      let twelfthMarksheetUrl = null;
      if (documents.twelfthMarksheet) {
        const twelfthPath = `12th-marksheets/${Date.now()}_${documents.twelfthMarksheet.name}`;
        twelfthMarksheetUrl = await uploadFile(documents.twelfthMarksheet, 'employee-documents', twelfthPath);
      }

      // 6. Upload Katyayani Letter if provided
      let katyayaniLetterUrl = null;
      if (documents.katyayaniLetter) {
        const letterPath = `katyayani-letters/${Date.now()}_${documents.katyayaniLetter.name}`;
        katyayaniLetterUrl = await uploadFile(documents.katyayaniLetter, 'employee-documents', letterPath);
      }

      // 7. Insert employee data
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .insert([
          {
            name: form.name,
            email: form.email,
            alternate_email: form.alternateEmail,
            date_of_birth: form.dateOfBirth,
            marital_status: form.maritalStatus,
            blood_group: form.bloodGroup,
            phone: form.phone,
            mobile: form.mobile,
            alternate_phone: form.alternatePhone,
            current_address: form.currentAddress,
            current_city: form.currentCity,
            current_state: form.currentState,
            current_pincode: form.currentPincode,
            permanent_address: form.permanentAddress,
            permanent_city: form.permanentCity,
            permanent_state: form.permanentState,
            permanent_pincode: form.permanentPincode,
            father_name: form.fatherName,
            mother_name: form.motherName,
            spouse_name: form.spouseName || null,
            number_of_children: parseInt(form.numberOfChildren) || 0,
            guardian_name: form.guardianName,
            guardian_relation: form.guardianRelation,
            guardian_phone: form.guardianPhone,
            guardian_address: form.guardianAddress,
            emergency_contact_name: form.emergencyContactName,
            emergency_contact_relation: form.emergencyContactRelation,
            emergency_contact_phone: form.emergencyContactPhone,
            bank_name: form.bankName,
            account_number: form.accountNumber,
            ifsc_code: form.ifscCode,
            account_holder_name: form.accountHolderName,
            branch_name: form.branchName,
            bank_proof_url: bankProofUrl,
            tenth_board: form.tenth_board,
            tenth_school: form.tenth_school,
            tenth_year: parseInt(form.tenth_year),
            tenth_percentage: form.tenth_percentage,
            tenth_marksheet_url: tenthMarksheetUrl,
            twelfth_board: form.twelfth_board,
            twelfth_school: form.twelfth_school,
            twelfth_year: parseInt(form.twelfth_year),
            twelfth_percentage: form.twelfth_percentage,
            twelfth_marksheet_url: twelfthMarksheetUrl,
            aadhaar_number: form.aadhaarNumber,
            aadhaar_card_url: aadhaarCardUrl,
            pan_number: form.panNumber,
            pan_card_url: panCardUrl,
            has_katyayani_letter: form.hasKatyayaniLetter,
            katyayani_letter_url: katyayaniLetterUrl,
          }
        ])
        .select();

      if (employeeError) throw employeeError;

      const employeeId = employeeData[0].id;

      // 4. Upload education certificates and insert records
      for (const edu of educationList) {
        let certificateUrl = null;
        
        if (edu.certificate) {
          const certPath = `education-certificates/${employeeId}/${Date.now()}_${edu.certificate.name}`;
          certificateUrl = await uploadFile(edu.certificate, 'employee-documents', certPath);
        }

        const { error: educationError } = await supabase
          .from('education')
          .insert([{
            employee_id: employeeId,
            degree: edu.degree,
            institution: edu.institution,
            field_of_study: edu.fieldOfStudy,
            year_of_passing: parseInt(edu.yearOfPassing),
            grade: edu.grade,
            certificate_url: certificateUrl,
          }]);

        if (educationError) throw educationError;
      }

      // 5. Upload work experience documents and insert records
      for (const exp of workExperienceList) {
        let salarySlipUrl = null;
        let relievingLetterUrl = null;
        let experienceLetterUrl = null;

        if (exp.salarySlip) {
          const salaryPath = `salary-slips/${employeeId}/${Date.now()}_${exp.salarySlip.name}`;
          salarySlipUrl = await uploadFile(exp.salarySlip, 'employee-documents', salaryPath);
        }

        if (exp.relievingLetter) {
          const relievingPath = `relieving-letters/${employeeId}/${Date.now()}_${exp.relievingLetter.name}`;
          relievingLetterUrl = await uploadFile(exp.relievingLetter, 'employee-documents', relievingPath);
        }

        if (exp.experienceLetter) {
          const experiencePath = `experience-letters/${employeeId}/${Date.now()}_${exp.experienceLetter.name}`;
          experienceLetterUrl = await uploadFile(exp.experienceLetter, 'employee-documents', experiencePath);
        }

        const { error: workError } = await supabase
          .from('work_experience')
          .insert([
            {
              employee_id: employeeId,
              company_name: exp.companyName,
              designation: exp.designation,
              from_date: exp.fromDate,
              to_date: exp.toDate,
              salary: exp.salary,
              salary_slip_url: salarySlipUrl,
              relieving_letter_url: relievingLetterUrl,
              experience_letter_url: experienceLetterUrl,
            }
          ]);

        if (workError) throw workError;
      }

      alert("Employee form submitted successfully!");
      
      // Reset form
      // Reset form
      setForm({
        name: "",
        email: "",
        alternateEmail: "",
        dateOfBirth: "",
        maritalStatus: "",
        bloodGroup: "",
        phone: "",
        mobile: "",
        alternatePhone: "",
        currentAddress: "",
        currentCity: "",
        currentState: "",
        currentPincode: "",
        permanentAddress: "",
        permanentCity: "",
        permanentState: "",
        permanentPincode: "",
        fatherName: "",
        motherName: "",
        spouseName: "",
        numberOfChildren: "",
        guardianName: "",
        guardianRelation: "",
        guardianPhone: "",
        guardianAddress: "",
        emergencyContactName: "",
        emergencyContactRelation: "",
        emergencyContactPhone: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        branchName: "",
        aadhaarNumber: "",
        panNumber: "",
      });
      setDocuments({
        aadhaarCard: null,
        panCard: null,
      });
      setEducationList([
        {
          id: 1,
          degree: "",
          institution: "",
          fieldOfStudy: "",
          yearOfPassing: "",
          grade: "",
        },
      ]);
    } catch (error) {
      alert("Error submitting form. Please try again.");
      console.error(error);
    }
  };

  const copyToCurrentAddress = () => {
    setForm({
      ...form,
      currentAddress: form.permanentAddress,
      currentCity: form.permanentCity,
      currentState: form.permanentState,
      currentPincode: form.permanentPincode,
    });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="employee-form">
        <h2 className="form-title">Employee Registration Form</h2>

        {/* Personal Information Section */}
        <div className="form-section">
          <h3 className="section-title">Personal Information</h3>
          
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group *</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="maritalStatus">Marital Status *</label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="form-section">
          <h3 className="section-title">Contact Information</h3>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="alternateEmail">Alternate Email</label>
            <input
              id="alternateEmail"
              name="alternateEmail"
              type="email"
              placeholder="Enter alternate email"
              value={form.alternateEmail}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Mobile Number *</label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="Enter mobile number"
                value={form.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="alternatePhone">Alternate Phone</label>
            <input
              id="alternatePhone"
              name="alternatePhone"
              type="tel"
              placeholder="Enter alternate phone"
              value={form.alternatePhone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Current Address Section */}
        <div className="form-section">
          <h3 className="section-title">Current Address</h3>
          
          <div className="form-group">
            <label htmlFor="currentAddress">Street Address *</label>
            <textarea
              id="currentAddress"
              name="currentAddress"
              placeholder="Enter current address"
              value={form.currentAddress}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="currentCity">City *</label>
              <input
                id="currentCity"
                name="currentCity"
                type="text"
                placeholder="City"
                value={form.currentCity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currentState">State *</label>
              <input
                id="currentState"
                name="currentState"
                type="text"
                placeholder="State"
                value={form.currentState}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="currentPincode">Pincode *</label>
            <input
              id="currentPincode"
              name="currentPincode"
              type="text"
              placeholder="Pincode"
              value={form.currentPincode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Permanent Address Section */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">Permanent Address</h3>
            <button
              type="button"
              className="copy-btn"
              onClick={copyToCurrentAddress}
            >
              Same as Current
            </button>
          </div>
          
          <div className="form-group">
            <label htmlFor="permanentAddress">Street Address *</label>
            <textarea
              id="permanentAddress"
              name="permanentAddress"
              placeholder="Enter permanent address"
              value={form.permanentAddress}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="permanentCity">City *</label>
              <input
                id="permanentCity"
                name="permanentCity"
                type="text"
                placeholder="City"
                value={form.permanentCity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="permanentState">State *</label>
              <input
                id="permanentState"
                name="permanentState"
                type="text"
                placeholder="State"
                value={form.permanentState}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="permanentPincode">Pincode *</label>
            <input
              id="permanentPincode"
              name="permanentPincode"
              type="text"
              placeholder="Pincode"
              value={form.permanentPincode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* 10th & 12th Marksheet Section */}
        <div className="form-section">
          <h3 className="section-title">10th & 12th Education (Mandatory)</h3>
          
          {/* 10th Details */}
          <h4 style={{color: '#667eea', marginBottom: '15px', fontSize: '18px'}}>10th Standard</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tenth_board">Board *</label>
              <input
                id="tenth_board"
                name="tenth_board"
                type="text"
                placeholder="e.g., CBSE, State Board"
                value={form.tenth_board}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tenth_school">School Name *</label>
              <input
                id="tenth_school"
                name="tenth_school"
                type="text"
                placeholder="Enter school name"
                value={form.tenth_school}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tenth_year">Year of Passing *</label>
              <input
                id="tenth_year"
                name="tenth_year"
                type="number"
                placeholder="e.g., 2015"
                value={form.tenth_year}
                onChange={handleChange}
                min="1950"
                max="2030"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tenth_percentage">Percentage/CGPA *</label>
              <input
                id="tenth_percentage"
                name="tenth_percentage"
                type="text"
                placeholder="e.g., 85% or 8.5 CGPA"
                value={form.tenth_percentage}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tenthMarksheet">10th Marksheet *</label>
            <input
              id="tenthMarksheet"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleDocumentChange("tenthMarksheet", e.target.files[0])}
              required
            />
            {documents.tenthMarksheet && (
              <p className="file-name">Selected: {documents.tenthMarksheet.name}</p>
            )}
          </div>

          <hr style={{margin: '30px 0', border: 'none', borderTop: '2px solid #e9ecef'}} />

          {/* 12th Details */}
          <h4 style={{color: '#667eea', marginBottom: '15px', fontSize: '18px'}}>12th Standard</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="twelfth_board">Board *</label>
              <input
                id="twelfth_board"
                name="twelfth_board"
                type="text"
                placeholder="e.g., CBSE, State Board"
                value={form.twelfth_board}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="twelfth_school">School Name *</label>
              <input
                id="twelfth_school"
                name="twelfth_school"
                type="text"
                placeholder="Enter school name"
                value={form.twelfth_school}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="twelfth_year">Year of Passing *</label>
              <input
                id="twelfth_year"
                name="twelfth_year"
                type="number"
                placeholder="e.g., 2017"
                value={form.twelfth_year}
                onChange={handleChange}
                min="1950"
                max="2030"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="twelfth_percentage">Percentage/CGPA *</label>
              <input
                id="twelfth_percentage"
                name="twelfth_percentage"
                type="text"
                placeholder="e.g., 85% or 8.5 CGPA"
                value={form.twelfth_percentage}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="twelfthMarksheet">12th Marksheet *</label>
            <input
              id="twelfthMarksheet"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleDocumentChange("twelfthMarksheet", e.target.files[0])}
              required
            />
            {documents.twelfthMarksheet && (
              <p className="file-name">Selected: {documents.twelfthMarksheet.name}</p>
            )}
          </div>
        </div>

        {/* Education Section */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">Higher Education Details (Optional)</h3>
            <button
              type="button"
              className="add-btn"
              onClick={addEducation}
            >
              + Add Education
            </button>
          </div>

          {educationList.map((education, index) => (
            <div key={education.id} className="education-item">
              <div className="education-header">
                <h4>Education {index + 1}</h4>
                {educationList.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeEducation(education.id)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`degree-${education.id}`}>Degree/Qualification *</label>
                <input
                  id={`degree-${education.id}`}
                  type="text"
                  placeholder="e.g., Bachelor of Technology"
                  value={education.degree}
                  onChange={(e) =>
                    handleEducationChange(education.id, "degree", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`institution-${education.id}`}>Institution/University *</label>
                <input
                  id={`institution-${education.id}`}
                  type="text"
                  placeholder="e.g., ABC University"
                  value={education.institution}
                  onChange={(e) =>
                    handleEducationChange(education.id, "institution", e.target.value)
                  }
                  required
                />
              </div>

                  <div className="form-group">
                    <label htmlFor={`fieldOfStudy-${education.id}`}>Field of Study *</label>
                    <input
                      id={`fieldOfStudy-${education.id}`}
                      type="text"
                      placeholder="e.g., Computer Science"
                      value={education.fieldOfStudy}
                      onChange={(e) =>
                        handleEducationChange(education.id, "fieldOfStudy", e.target.value)
                      }
                      required
                    />
                  </div>
    
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`yearOfPassing-${education.id}`}>Year of Passing *</label>
                      <input
                        id={`yearOfPassing-${education.id}`}
                        type="number"
                        placeholder="e.g., 2020"
                        value={education.yearOfPassing}
                        onChange={(e) =>
                          handleEducationChange(education.id, "yearOfPassing", e.target.value)
                        }
                        min="1950"
                        max="2030"
                        required
                      />
                    </div>
    
                    <div className="form-group">
                      <label htmlFor={`grade-${education.id}`}>Grade/Percentage *</label>
                      <input
                        id={`grade-${education.id}`}
                        type="text"
                        placeholder="e.g., 8.5 CGPA or 85%"
                        value={education.grade}
                        onChange={(e) =>
                          handleEducationChange(education.id, "grade", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor={`certificate-${education.id}`}>Certificate/Marksheet *</label>
                    <input
                      id={`certificate-${education.id}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleEducationChange(education.id, "certificate", e.target.files[0])
                      }
                      required
                    />
                    {education.certificate && (
                      <p className="file-name">Selected: {education.certificate.name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
    
            {/* Work Experience Section */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">Work Experience</h3>
            <button
              type="button"
              className="add-btn"
              onClick={addWorkExperience}
            >
              + Add Work Experience
            </button>
          </div>

          {workExperienceList.map((experience, index) => (
            <div key={experience.id} className="education-item">
              <div className="education-header">
                <h4>Experience {index + 1}</h4>
                {workExperienceList.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeWorkExperience(experience.id)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`companyName-${experience.id}`}>Company Name *</label>
                <input
                  id={`companyName-${experience.id}`}
                  type="text"
                  placeholder="Enter company name"
                  value={experience.companyName}
                  onChange={(e) =>
                    handleWorkExperienceChange(experience.id, "companyName", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`designation-${experience.id}`}>Designation *</label>
                <input
                  id={`designation-${experience.id}`}
                  type="text"
                  placeholder="Enter designation/position"
                  value={experience.designation}
                  onChange={(e) =>
                    handleWorkExperienceChange(experience.id, "designation", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`fromDate-${experience.id}`}>From Date *</label>
                  <input
                    id={`fromDate-${experience.id}`}
                    type="date"
                    value={experience.fromDate}
                    onChange={(e) =>
                      handleWorkExperienceChange(experience.id, "fromDate", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`toDate-${experience.id}`}>To Date *</label>
                  <input
                    id={`toDate-${experience.id}`}
                    type="date"
                    value={experience.toDate}
                    onChange={(e) =>
                      handleWorkExperienceChange(experience.id, "toDate", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`salary-${experience.id}`}>Last Salary (CTC) *</label>
                <input
                  id={`salary-${experience.id}`}
                  type="text"
                  placeholder="e.g., 5,00,000 per annum"
                  value={experience.salary}
                  onChange={(e) =>
                    handleWorkExperienceChange(experience.id, "salary", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`salarySlip-${experience.id}`}>
                  Salary Slip (Last 3 months) (Optional)
                </label>
                <input
                  id={`salarySlip-${experience.id}`}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange(experience.id, "salarySlip", e.target.files[0])
                  }
                />
                <small className="file-hint">Upload PDF, JPG, or PNG (Max 5MB)</small>
              </div>

              <div className="form-group">
                <label htmlFor={`relievingLetter-${experience.id}`}>
                  Relieving Letter (Optional)
                </label>
                <input
                  id={`relievingLetter-${experience.id}`}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange(experience.id, "relievingLetter", e.target.files[0])
                  }
                />
                <small className="file-hint">Upload PDF, JPG, or PNG (Max 5MB)</small>
              </div>

              <div className="form-group">
                <label htmlFor={`experienceLetter-${experience.id}`}>
                  Experience Letter (Optional)
                </label>
                <input
                  id={`experienceLetter-${experience.id}`}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange(experience.id, "experienceLetter", e.target.files[0])
                  }
                />
                <small className="file-hint">Upload PDF, JPG, or PNG (Max 5MB)</small>
              </div>

              {experience.salarySlip && (
                <div className="file-preview">
                  <strong>Salary Slip:</strong> {experience.salarySlip.name}
                </div>
              )}
              {experience.relievingLetter && (
                <div className="file-preview">
                  <strong>Relieving Letter:</strong> {experience.relievingLetter.name}
                </div>
              )}
              {experience.experienceLetter && (
                <div className="file-preview">
                  <strong>Experience Letter:</strong> {experience.experienceLetter.name}
                </div>
              )}
            </div>
          ))}
        </div>

        {/*         handleEducationChange(education.id, "fieldOfStudy", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`yearOfPassing-${education.id}`}>Year of Passing *</label>
                  <input
                    id={`yearOfPassing-${education.id}`}
                    type="number"
                    placeholder="e.g., 2020"
                    value={education.yearOfPassing}
                    onChange={(e) =>
                      handleEducationChange(education.id, "yearOfPassing", e.target.value)
                    }
                    min="1950"
                    max="2030"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`grade-${education.id}`}>Grade/Percentage *</label>
                  <input
                    id={`grade-${education.id}`}
                    type="text"
                    placeholder="e.g., 8.5 CGPA or 85%"
                    value={education.grade}
                    onChange={(e) =>
                      handleEducationChange(education.id, "grade", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Family Information Section */}
        <div className="form-section">
          <h3 className="section-title">Family Information</h3>
          
          <div className="form-group">
            <label htmlFor="fatherName">Father's Name *</label>
            <input
              id="fatherName"
              name="fatherName"
              type="text"
              placeholder="Enter father's name"
              value={form.fatherName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="motherName">Mother's Name *</label>
            <input
              id="motherName"
              name="motherName"
              type="text"
              placeholder="Enter mother's name"
              value={form.motherName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="spouseName">Spouse Name</label>
              <input
                id="spouseName"
                name="spouseName"
                type="text"
                placeholder="Enter spouse name"
                value={form.spouseName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="numberOfChildren">Number of Children</label>
              <input
                id="numberOfChildren"
                name="numberOfChildren"
                type="number"
                placeholder="0"
                value={form.numberOfChildren}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Guardian Information Section */}
        <div className="form-section">
          <h3 className="section-title">Guardian Information</h3>
          
          <div className="form-group">
            <label htmlFor="guardianName">Guardian Name *</label>
            <input
              id="guardianName"
              name="guardianName"
              type="text"
              placeholder="Enter guardian name"
              value={form.guardianName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="guardianRelation">Relation *</label>
              <select
                id="guardianRelation"
                name="guardianRelation"
                value={form.guardianRelation}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="guardianPhone">Guardian Phone *</label>
              <input
                id="guardianPhone"
                name="guardianPhone"
                type="tel"
                placeholder="Enter phone number"
                value={form.guardianPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="guardianAddress">Guardian Address *</label>
            <textarea
              id="guardianAddress"
              name="guardianAddress"
              placeholder="Enter guardian address"
              value={form.guardianAddress}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="form-section">
          <h3 className="section-title">Emergency Contact</h3>
          
          <div className="form-group">
            <label htmlFor="emergencyContactName">Contact Name *</label>
            <input
              id="emergencyContactName"
              name="emergencyContactName"
              type="text"
              placeholder="Enter emergency contact name"
              value={form.emergencyContactName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="emergencyContactRelation">Relation *</label>
              <select
                id="emergencyContactRelation"
                name="emergencyContactRelation"
                value={form.emergencyContactRelation}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Parent">Parent</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="emergencyContactPhone">Contact Phone *</label>
              <input
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                type="tel"
                placeholder="Enter phone number"
                value={form.emergencyContactPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="form-section">
          <h3 className="section-title">Bank Details</h3>
          
          <div className="form-group">
            <label htmlFor="bankName">Bank Name *</label>
            <input
              id="bankName"
              name="bankName"
              type="text"
              placeholder="Enter bank name"
              value={form.bankName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountHolderName">Account Holder Name *</label>
            <input
              id="accountHolderName"
              name="accountHolderName"
              type="text"
              placeholder="Enter account holder name"
              value={form.accountHolderName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="accountNumber">Account Number *</label>
              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                placeholder="Enter account number"
                value={form.accountNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ifscCode">IFSC Code *</label>
              <input
                id="ifscCode"
                name="ifscCode"
                type="text"
                placeholder="Enter IFSC code"
                value={form.ifscCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="branchName">Branch Name *</label>
            <input
              id="branchName"
              name="branchName"
              type="text"
              placeholder="Enter branch name"
              value={form.branchName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bankProof">Bank Proof (Cancelled Cheque / Passbook) *</label>
            <input
              id="bankProof"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleDocumentChange("bankProof", e.target.files[0])}
              required
            />
            {documents.bankProof && (
              <p className="file-name">Selected: {documents.bankProof.name}</p>
            )}
          </div>
        </div>

        {/* Documents Section */}
        <div className="form-section">
          <h3 className="section-title">Identity Documents</h3>
          
          <div className="form-group">
            <label htmlFor="aadhaarNumber">Aadhaar Number *</label>
            <input
              id="aadhaarNumber"
              name="aadhaarNumber"
              type="text"
              placeholder="Enter 12-digit Aadhaar number"
              value={form.aadhaarNumber}
              onChange={handleChange}
              maxLength="12"
              pattern="[0-9]{12}"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="aadhaarCard">Upload Aadhaar Card *</label>
            <input
              id="aadhaarCard"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleDocumentChange("aadhaarCard", e.target.files[0])}
              required
            />
            <small className="file-hint">Upload PDF, JPG, or PNG (Max 5MB)</small>
            {documents.aadhaarCard && (
              <div className="file-preview">
                <strong>Aadhaar Card:</strong> {documents.aadhaarCard.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="panNumber">PAN Number *</label>
            <input
              id="panNumber"
              name="panNumber"
              type="text"
              placeholder="Enter PAN number (e.g., ABCDE1234F)"
              value={form.panNumber}
              onChange={handleChange}
              maxLength="10"
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              style={{ textTransform: 'uppercase' }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="panCard">Upload PAN Card *</label>
            <input
              id="panCard"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleDocumentChange("panCard", e.target.files[0])}
              required
            />
            <small className="file-hint">Upload PDF, JPG, or PNG (Max 5MB)</small>
            {documents.panCard && (
              <div className="file-preview">
                <strong>PAN Card:</strong> {documents.panCard.name}
              </div>
            )}
          </div>
        </div>

        {/* Katyayani Offer/Appointment Letter Section */}
        <div className="form-section">
          <h3 className="section-title">Katyayani Offer/Appointment Letter</h3>
          
          <div className="form-group">
            <label>Do you have a Katyayani Offer Letter or Appointment Letter? *</label>
            <div style={{display: 'flex', gap: '20px', marginTop: '10px'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                <input
                  type="radio"
                  name="hasKatyayaniLetter"
                  value="yes"
                  checked={form.hasKatyayaniLetter === "yes"}
                  onChange={handleChange}
                  required
                />
                <span>Yes</span>
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                <input
                  type="radio"
                  name="hasKatyayaniLetter"
                  value="no"
                  checked={form.hasKatyayaniLetter === "no"}
                  onChange={handleChange}
                  required
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {form.hasKatyayaniLetter === "yes" && (
            <div className="form-group">
              <label htmlFor="katyayaniLetter">Upload Offer/Appointment Letter *</label>
              <input
                id="katyayaniLetter"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleDocumentChange("katyayaniLetter", e.target.files[0])}
                required
              />
              <small className="file-hint">Upload PDF, JPG, or PNG (Max 5MB)</small>
              {documents.katyayaniLetter && (
                <div className="file-preview">
                  <strong>Katyayani Letter:</strong> {documents.katyayaniLetter.name}
                </div>
              )}
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Submit Form
        </button>
      </form>
    </div>
  );
}
