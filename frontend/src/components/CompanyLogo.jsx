import { API_BASE } from '../config';

export default function CompanyLogo({ company, size = 'md' }) {
  if (company.logo) {
    return (
      <img
        src={`${API_BASE}${company.logo}`}
        alt={`${company.name} logo`}
        className={`company-logo-img company-logo-${size}`}
      />
    );
  }

  return (
    <div
      className={`company-logo-placeholder company-logo-${size}`}
      style={{ backgroundColor: company.logoColor || '#1e3a5f' }}
    >
      {company.logoText || company.name?.charAt(0)}
    </div>
  );
}
