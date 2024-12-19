import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

interface Container {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
  health?: string;
}

const ContainerStatus: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/containers');
        setContainers(response.data);
      } catch {
        toast.error('Failed to fetch container statuses!');
      } finally {
        setLoading(false);
      }
    };

    fetchContainers();
    const interval = setInterval(fetchContainers, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (state: string) => {
    switch (state.toLowerCase()) {
      case 'running':
        return <FaCheckCircle className="text-green-500" />;
      case 'exited':
        return <FaExclamationCircle className="text-red-500" />;
      default:
        return <FaSpinner className="text-yellow-500 animate-spin" />;
    }
  };

  const getHealthPercentage = (health: string | undefined): number => {
    switch (health?.toLowerCase()) {
      case 'healthy':
        return 100;
      case 'unhealthy':
        return 0;
      case 'starting':
        return 100;
      default:
        return 0; // Default to unhealthy if health is undefined
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-4">Docker Container Status</h1>
        <hr />
      </div>
      <ToastContainer />
      {loading ? (
        <div className="flex justify-center items-center">
          <FaSpinner className="text-4xl text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {containers.map((container) => (
            <div key={container.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">{container.name}</h2>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(container.state)}
                <span className="text-gray-700"><strong>State:</strong> {container.state}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getHealthPercentage(container.health) === 100
                    ? 'bg-green-500'
                    : getHealthPercentage(container.health) === 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                    }`}
                  style={{ width: `${getHealthPercentage(container.health)}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                <strong>Health:</strong> {container.health || 'Unknown'}
              </span>
              <p className="text-gray-700 mt-2"><strong>Status:</strong> {container.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContainerStatus;