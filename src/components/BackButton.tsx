import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from '@progress/kendo-react-buttons';

const BackButton = () => {
  const navigate = useNavigate();
  
  return (
    <Button
      themeColor="light"
      onClick={() => navigate(-1)}
      className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Back
    </Button>
  );
};

export default BackButton;
