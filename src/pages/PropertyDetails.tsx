import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

export default function PropertyDetails() {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Property Details: {id}</h1>
        <p className="text-slate-500">Unit management coming next...</p>
      </div>
    </DashboardLayout>
  );
}