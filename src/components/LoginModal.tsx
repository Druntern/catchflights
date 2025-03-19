import { motion } from 'framer-motion';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '../lib/supabase';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useLocation } from 'react-router-dom';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

interface LoginModalProps {
    showLoginForm: boolean;
    setShowLoginModal?: (value: boolean) => void;
    modal?: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ showLoginForm, setShowLoginModal, modal }) => {
  const location = useLocation();

  const handleClose = () => {
    if (setShowLoginModal) {
      setShowLoginModal(false);
    }
  };

  return showLoginForm ? (
    <Dialog
      onClose={handleClose}
      title="Login or Sign Up"
      className="k-dialog-wrapper"
    >
      <div className="p-6">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          redirectTo={`${window.location.origin + location.pathname}`}
        />
      </div>
      <DialogActionsBar>
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          onClick={handleClose}
        >
          Close
        </button>
      </DialogActionsBar>
    </Dialog>
  ) : null;
};

export default LoginModal;