import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { loginSchema } from '../../utils/validation';

const DEMO_PROFILES = [
  { role: 'Fleet Manager', email: 'manager@transitops.com', pass: 'manager123', className: 'badge-blue' },
  { role: 'Driver', email: 'driver@transitops.com', pass: 'driver123', className: 'badge-green' },
  { role: 'Safety Officer', email: 'safety@transitops.com', pass: 'safety123', className: 'badge-orange' },
  { role: 'Financial Analyst', email: 'finance@transitops.com', pass: 'finance123', className: 'badge-grape' },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Intercept data passed from successful registration redirect
  const bannerMessage = location.state?.successMessage || null;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleQuickSelect = (profile) => {
    setValue('email', profile.email);
    setValue('password', profile.pass);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data);
      const { access_token, role } = response.data;

      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user_role', role);

      // Wipe routing history stack cleanly to protect authenticated core dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Access Denied: Invalid parameters matching DB keys.');
    }
  };

  return (
    <div className="auth-wrapper light-theme">
      <div className="clay-auth-box">
        
        {/* Claymorphic Native Context Redirect Banner */}
        {bannerMessage && (
          <div className="clay-banner-success">
            <span className="banner-orb">✓</span>
            <p>{bannerMessage}</p>
          </div>
        )}

        <div className="auth-header">
          <h2>Console Authorization</h2>
          <p>Provide verified operator access parameters.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="clay-input-group">
            <label>Corporate Mail Identifier</label>
            <input 
              type="email" 
              placeholder="operator@transitops.com" 
              {...register('email')}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="clay-error-txt">{errors.email.message}</span>}
          </div>

          <div className="clay-input-group">
            <label>Secure Core Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              {...register('password')}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="clay-error-txt">{errors.password.message}</span>}
          </div>

          <button type="submit" className="clay-btn clay-btn-primary full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying Link...' : 'Establish Connection'}
          </button>
        </form>

        <div className="auth-footer-links">
          <p>New operator asset? <Link to="/register">Register Profile Here</Link></p>
        </div>

        <div className="dev-injector-section">
          <span className="injector-title">DEMO CONSOLE BYPASS SEEDERS</span>
          <div className="injector-list">
            {DEMO_PROFILES.map((profile, idx) => (
              <div key={idx} className="injector-row" onClick={() => handleQuickSelect(profile)}>
                <span className="injector-email">{profile.email}</span>
                <span className={`custom-badge ${profile.className}`}>{profile.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}