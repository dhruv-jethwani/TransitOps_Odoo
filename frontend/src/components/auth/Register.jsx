import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { registerSchema } from '../../utils/validation';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  // Keep a live watch on the active keystrokes inside the password container field
  const passwordValue = watch('password', '');

  // Calculate strength percentage metrics on the fly
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, color: 'strength-none' };
    let points = 0;
    if (pass.length >= 8) points += 33;
    if (/[A-Z]/.test(pass)) points += 33;
    if (/[0-9]/.test(pass)) points += 34;
    
    if (points <= 33) return { score: points, color: 'strength-weak' };
    if (points <= 66) return { score: points, color: 'strength-medium' };
    return { score: points, color: 'strength-strong' };
  };

  const { score: strength, color: strengthColor } = calculatePasswordStrength(passwordValue);
  const handleTogglePassword = () => setShowPassword(!showPassword);

  const onSubmit = async (data) => {
    try {
      // Discard matching token validation layer before dispatching payload properties over wire
      const { name, email, password } = data;
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });

      // Transfer state parameter cleanly into route configuration options
      navigate('/login', { 
        state: { successMessage: 'Operator profile registered successfully. Authenticate terminal.' } 
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Registration aborted: Database parameter duplication conflict.');
    }
  };

  return (
    <div className="auth-wrapper light-theme">
      <div className="clay-auth-box">
        <div className="auth-header">
          <h2>Create Profile</h2>
          <p>Register new credentials onto the fleet infrastructure registry.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="clay-input-group">
            <label>Full Legal Name</label>
            <input 
              type="text" 
              placeholder="Alex Driver" 
              {...register('name')}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="clay-error-txt">{errors.name.message}</span>}
          </div>

          <div className="clay-input-group">
            <label>Corporate Email Identity</label>
            <input 
              type="email" 
              placeholder="name@transitops.com" 
              {...register('email')}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="clay-error-txt">{errors.email.message}</span>}
          </div>

          {/* Secure Input Module Wrapper Block */}
          <div className="clay-input-group relative-container">
            <label>Set Cryptographic Password</label>
            <div className="input-with-icon-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                {...register('password')}
                className={errors.password ? 'input-error' : ''}
              />
              <button 
                className="absolute-eye-toggle" 
                type="button" 
                onClick={handleTogglePassword}
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Claymorphic Fluid Bar Visual representation */}
            <div className="strength-meter-track">
              <div 
                className={`strength-meter-bar ${strengthColor}`} 
                style={{ width: `${strength}%` }}
              />
            </div>

            {/* Validation Checkpoint Criteria Layout Grid matrix */}
            <div className="strength-criteria-grid">
              <div className={`criteria-item ${passwordValue.length >= 8 ? 'active-green' : 'disabled-slate'}`}>
                <span className="bullet-dot" /> 8+ Characters
              </div>
              <div className={`criteria-item ${/[A-Z]/.test(passwordValue) ? 'active-green' : 'disabled-slate'}`}>
                <span className="bullet-dot" /> Uppercase
              </div>
              <div className={`criteria-item ${/[0-9]/.test(passwordValue) ? 'active-green' : 'disabled-slate'}`}>
                <span className="bullet-dot" /> One Number
              </div>
            </div>
            {errors.password && <span className="clay-error-txt block-spacing">{errors.password.message}</span>}
          </div>

          <div className="clay-input-group">
            <label>Confirm Console Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="clay-error-txt">{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="clay-btn clay-btn-primary full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Provision Operator Profile'}
          </button>
        </form>

        <div className="auth-footer-links">
          <p>Already linked? <Link to="/login">Verify Terminal Base</Link></p>
        </div>
      </div>
    </div>
  );
}