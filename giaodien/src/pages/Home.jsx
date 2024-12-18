import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Trophy, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 animate-fade-in">
            EVENT AND PARTY
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hãy tự tay mình tổ chức ra một sự kiện thật tuyệt vời nào
          </p>
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
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Làm theo sở thích của cá nhân</h3>
            <p className="text-gray-600">Tổ chức một sự kiện theo sở thích của chính mình</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Gợi ý </h3>
            <p className="text-gray-600">Các gợi ý với các mô hình sự kiện nổi bật</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Đánh giá cá nhân</h3>
            <p className="text-gray-600">Đánh giá về các mô hình và dịch vụ đã trải nghiệm</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Cộng đồng sôi nổi</h3>
            <p className="text-gray-600">Tham gia cộng đồng sự kiện trên toàn quốc</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/80 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">1000+</div>
              <div className="text-gray-600">Dịch vụ</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">50K+</div>
              <div className="text-gray-600">Người dùng</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">20+</div>
              <div className="text-gray-600">Mô hình</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">100K+</div>
              <div className="text-gray-600">Lượt dùng</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;