const PrivacyPolicy = () => {
  return (
    <div className="bg-white p-6 rounded-2xl mb-4">
      <h1 className="text-[24px] text-[#181818] font-semibold mb-4">
        Privacy Policy
      </h1>

      <p className="text-[15px] text-[#5C5C5C] mb-2">
        <strong>Effective Date:</strong> June 19, 2025
        <br />
        <strong>Last Updated:</strong> June 19, 2025
      </p>

      <p className="text-[15px] text-[#5C5C5C] mb-4">
        This Privacy Policy describes how CREWROOMZ, LLC (“Company,” “we,” “us,”
        or “our”) collects, uses, discloses, and protects your personal
        information when you access or use our mobile application, website, and
        associated services (collectively, the “Platform”). By using the
        Platform, you consent to the practices described herein.
      </p>

      <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
        1. Information We Collect
      </h2>
      <p className="text-[15px] text-[#5C5C5C] mb-1 font-medium">
        a. Information You Provide:
      </p>
      <ul className="list-disc list-inside text-[15px] text-[#5C5C5C] mb-2">
        <li>Full name, email address, and telephone number</li>
        <li>
          Employment role within aviation (e.g., pilot, flight attendant,
          mechanic)
        </li>
        <li>
          Payment credentials (processed via third-party payment gateways)
        </li>
        <li>Crashpad listing details (for Hosts)</li>
        <li>Communication and booking history</li>
      </ul>
      <p className="text-[15px] text-[#5C5C5C] mb-1 font-medium">
        b. Automatically Collected Information:
      </p>
      <ul className="list-disc list-inside text-[15px] text-[#5C5C5C] mb-4">
        <li>IP address, browser and device information</li>
        <li>Operating system, session identifiers, and usage activity</li>
        <li>Location data (subject to permission)</li>
        <li>Cookies and tracking technologies</li>
      </ul>

      <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
        2. Use of Information
      </h2>
      <ul className="list-disc list-inside text-[15px] text-[#5C5C5C] mb-4">
        <li>Operating, maintaining, and improving the Platform</li>
        <li>Processing bookings and payments</li>
        <li>Ensuring security and fraud prevention</li>
        <li>Complying with applicable legal obligations</li>
      </ul>

      <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
        3. Sharing of Information
      </h2>
      <ul className="list-disc list-inside text-[15px] text-[#5C5C5C] mb-4">
        <li>
          Authorized third-party vendors (e.g., payment and background screening
          processors)
        </li>
        <li>Regulatory or legal authorities upon valid request</li>
        <li>
          Our corporate affiliates and service providers, subject to
          confidentiality obligations
        </li>
      </ul>

      <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
        4. Data Retention
      </h2>
      <p className="text-[15px] text-[#5C5C5C] mb-4">
        We retain your data for as long as necessary to fulfill the purpose for
        which it was collected, or as required by applicable law. You may
        request deletion of your data by contacting us.
      </p>

      <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
        5. User Rights
      </h2>
      <ul className="list-disc list-inside text-[15px] text-[#5C5C5C] mb-4">
        <li>Request access, correction, or deletion of your data</li>
        <li>Object to processing or withdraw consent</li>
        <li>File complaints with supervisory authorities</li>
      </ul>

      <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
        6. Data Security
      </h2>
      <p className="text-[15px] text-[#5C5C5C] mb-4">
        We implement commercially reasonable administrative, physical, and
        technical safeguards to protect data integrity and confidentiality.
      </p>

      <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
        7. Children’s Privacy
      </h2>
      <p className="text-[15px] text-[#5C5C5C] mb-4">
        The Platform is not directed to individuals under 18. We do not
        knowingly collect information from minors.
      </p>

      <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
        8. International Transfers
      </h2>
      <p className="text-[15px] text-[#5C5C5C] mb-4">
        Your data may be processed and stored in jurisdictions outside of your
        country of residence. Appropriate safeguards will be used where legally
        required.
      </p>

      <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
        9. Changes
      </h2>
      <p className="text-[15px] text-[#5C5C5C] mb-4">
        We may revise this Privacy Policy at our discretion. Continued use
        constitutes acceptance of changes.
      </p>

      <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
        10. Contact Information
      </h2>
      <p className="text-[15px] text-[#5C5C5C]">
        CREWROOMZ, LLC
        <br />
        Email:{" "}
        <a
          href="mailto:info@crewroomz.com"
          className="text-[#29ABE2] underline"
        >
          info@crewroomz.com
        </a>
        <br />
        Mailing Address: 1317 Edgewater Dr #5293, Orlando, FL 32804
      </p>
    </div>
  );
};

export default PrivacyPolicy;
