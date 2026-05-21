import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import CompanyLogo from '../components/CompanyLogo';
import StarRating from '../components/StarRating';
import AddCompanyModal from '../components/AddCompanyModal';
import { PinIcon, ChevronDownIcon } from '../components/Icons';
import { getCompanies } from '../services/api';
import { formatDate } from '../utils/format';

export default function HomePage() {
  const [companies, setCompanies] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Indore, Madhya Pradesh, India');
  const [search, setSearch] = useState('');
  const [headerSearch, setHeaderSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCompanies({
        city,
        search: search || headerSearch,
        sortBy,
      });
      setCompanies(data.companies || []);
      setCount(data.count || 0);
    } catch {
      setCompanies([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [city, search, headerSearch, sortBy]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <div className="page page-home">
      <Header
        search={headerSearch}
        onSearchChange={setHeaderSearch}
        onSearchSubmit={() => {
          setSearch(headerSearch);
          fetchCompanies();
        }}
      />

      <main className="container main-content">
        <section className="filters-bar">
          <label className="filter-field">
            <span>Select City</span>
            <div className="filter-input-icon">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Indore, Madhya Pradesh, India"
              />
              <PinIcon className="filter-icon" />
            </div>
          </label>

          <button type="button" className="btn btn-find" onClick={fetchCompanies}>
            Find Company
          </button>

          <button type="button" className="btn btn-add-company" onClick={() => setShowAddModal(true)}>
            + Add Company
          </button>

          <label className="filter-field sort-field">
            <span>Sort:</span>
            <div className="select-wrap">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="founded">Founded</option>
                <option value="date">Date Added</option>
              </select>
              <ChevronDownIcon />
            </div>
          </label>
        </section>

        <p className="result-count">Result Found : {count}</p>

        {loading ? (
          <p className="loading-text">Loading companies...</p>
        ) : companies.length === 0 ? (
          <p className="empty-text">No companies found. Add one to get started.</p>
        ) : (
          <ul className="company-list">
            {companies.map((company) => (
              <li key={company._id} className="company-card">
                <CompanyLogo company={company} size="lg" />

                <div className="company-card-body">
                  <h3>{company.name}</h3>
                  <p className="company-address">
                    <PinIcon className="address-pin" />
                    {company.location}
                  </p>
                  <div className="company-rating-row">
                    <strong>{company.avgRating || '0'}</strong>
                    <StarRating value={company.avgRating || 0} size="sm" />
                    <span className="review-count">{company.reviewCount || 0} Reviews</span>
                  </div>
                </div>

                <div className="company-card-meta">
                  <span className="founded-label">
                    {company.foundedOn ? `Founded on ${formatDate(company.foundedOn)}` : ''}
                  </span>
                  <Link to={`/company/${company._id}`} className="btn btn-detail">
                    Detail Review
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <AddCompanyModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchCompanies}
      />
    </div>
  );
}
