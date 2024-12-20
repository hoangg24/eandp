import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { BookOpen, Brain, Trophy, Users } from 'lucide-react';
import { UserContext } from '../store/UserContext'; // Import UserContext

const Home = () => {
  const { user } = useContext(UserContext); // Lấy thông tin user từ UserContext

  // Framer Motion variants for feature animations
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.8 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 text-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 animate-fade-in">
            EVENT AND PARTY
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {user
              ? `Xin chào, Hãy khám phá các sự kiện của bạn.`
              : 'Hãy tự tay mình tổ chức ra một sự kiện thật tuyệt vời nào.'}
          </p>
          {/* Ẩn nút "Đăng nhập" và "Đăng ký" nếu user đã đăng nhập */}
          {!user && (
            <div className="flex justify-center gap-4 mt-8">
              <Link
                to="/login"
                className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-300"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-purple-600 rounded-full hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg border border-purple-200"
              >
                Đăng ký ngay
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {[
            { icon: <Brain />, title: 'Làm theo sở thích', text: 'Tổ chức một sự kiện theo sở thích' },
            { icon: <Trophy />, title: 'Gợi ý', text: 'Các gợi ý với các mô hình sự kiện nổi bật' },
            { icon: <BookOpen />, title: 'Đánh giá cá nhân', text: 'Đánh giá dịch vụ đã trải nghiệm' },
            { icon: <Users />, title: 'Cộng đồng sôi nổi', text: 'Tham gia cộng đồng sự kiện' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg text-gray-800"
              initial="hidden"
              animate="visible"
              custom={index}
              variants={featureVariants}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">
                <CountUp start={0} end={1000} duration={3} suffix="+" />
              </div>
              <div className="text-gray-600">Dịch vụ</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">
                <CountUp start={0} end={50000} duration={3} suffix="+" />
              </div>
              <div className="text-gray-600">Người dùng</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">
                <CountUp start={0} end={20} duration={3} suffix="+" />
              </div>
              <div className="text-gray-600">Mô hình</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">
                <CountUp start={0} end={100000} duration={3} suffix="+" />
              </div>
              <div className="text-gray-600">Lượt dùng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gray-100 text-gray-800 py-8">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-2">Tại sao chọn chúng tôi?</h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Chúng tôi mang đến giải pháp tổ chức sự kiện hoàn hảo với sự kết hợp giữa công nghệ và sáng tạo.
            Hãy để chúng tôi đồng hành cùng bạn!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
