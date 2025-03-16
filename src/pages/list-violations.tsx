import Layout from '@/components/layout/Layout';
import { API_URL } from '@/constant/env';
import React, { useState, useCallback, useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { fetchViolations, reportViolation } from '@/lib/api';

const gradientClasses = [
  'bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100',
  'bg-gradient-to-r from-blue-100 via-cyan-100 to-teal-100',
  'bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100',
  'bg-gradient-to-r from-emerald-100 via-green-100 to-lime-100',
  'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100',
];

const getRandomGradient = () => {
  return gradientClasses[Math.floor(Math.random() * gradientClasses.length)];
};

const Violations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('violations');

  const [violations, setViolations] = useState([]);
  const [loadingViolations, setLoadingViolations] = useState(true);
  const [loadingViolationsError, setLoadingViolationsError] = useState(null);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    const getViolationsFn = async () => {
      setLoadingViolations(true);
      try {
        const data = await fetchViolations();
        setViolations(data);
      } catch (err: any) {
        setLoadingViolationsError(err.message);
      } finally {
        setLoadingViolations(false);
      }
    };
    getViolationsFn();
  }, []);

  const toggleSidebar = useCallback(
    () => setSidebarOpen(!sidebarOpen),
    [sidebarOpen]
  );

  const handleReport = async () => {
    if (!selectedViolation) return;

    setIsReporting(true);
    const success = await reportViolation(selectedViolation.id);

    if (success) {
      alert('Báo cáo vi phạm thành công!');
    } else {
      alert('Không thể báo cáo vi phạm. Vui lòng thử lại sau!');
    }

    setIsReporting(false);
    setShowModal(false);
    setSelectedViolation(null);
  };

  return (
    <Layout>
      <div className='p-6'>
        <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
          <div className='border-b border-gray-200 bg-gradient-to-r from-red-100 to-orange-100 p-6'>
            <h2 className='flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent'>
              <FiAlertTriangle className='text-red-600' />
              Danh sách vi phạm
            </h2>
          </div>
          <div className='p-4'>
            {loadingViolations ? (
              <div className='py-4 text-center'>
                <p className='text-gray-500'>Đang tải danh sách vi phạm...</p>
              </div>
            ) : loadingViolationsError ? (
              <div className='py-4 text-center'>
                <p className='text-red-500'>{loadingViolationsError}</p>
              </div>
            ) : violations.length > 0 ? (
              <div className='grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                {violations.map((item: any) => (
                  <div
                    key={item.id}
                    className={`${getRandomGradient()} hover:scale-102 group relative h-full transform overflow-hidden rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    <div className='absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20'></div>
                    <div className='relative z-10 flex h-full flex-col justify-between'>
                      <div>
                        <div className='mb-3 flex items-center justify-between'>
                          <span className='rounded-full border border-red-100 bg-white/50 px-3 py-1 text-sm font-medium text-red-700 shadow-sm backdrop-blur-sm'>
                            ID: {item.id}
                          </span>
                          <span className='rounded-full bg-white/50 px-3 py-1 font-bold text-red-600 backdrop-blur-sm'>
                            -{item.deductedPoints} điểm
                          </span>
                        </div>
                        <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                          {item.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedViolation(item);
                          setShowModal(true);
                        }}
                        className='ml-auto mt-4 flex w-full items-center justify-center gap-2 self-start rounded-lg border border-red-200 bg-white/50 px-4 py-1.5 text-sm text-red-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md'
                      >
                        <FiAlertTriangle className='h-4 w-4' />
                        Báo cáo vi phạm
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-4 text-center'>
                <p className='text-gray-500'>Không có vi phạm nào</p>
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='mx-4 w-full max-w-md rounded-xl bg-white p-6'>
              <h3 className='mb-4 text-xl font-bold'>
                Xác nhận báo cáo vi phạm
              </h3>
              <p className='mb-4'>Bạn có chắc muốn báo cáo vi phạm này?</p>
              <div className='flex justify-end gap-4'>
                <button
                  onClick={() => setShowModal(false)}
                  className='rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200'
                >
                  Hủy
                </button>
                <button
                  onClick={handleReport}
                  disabled={isReporting}
                  className='rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50'
                >
                  {isReporting ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Violations;
