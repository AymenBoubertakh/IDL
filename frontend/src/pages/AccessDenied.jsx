import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-2">
          This page is restricted to administrators only.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          You don't have the necessary permissions to view this content.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            className="flex items-center justify-center gap-2"
          >
            Go to Dashboard
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-gray-400 text-xs mt-8">
          If you believe you should have access, please contact your system administrator.
        </p>
      </div>
    </div>
  );
}
