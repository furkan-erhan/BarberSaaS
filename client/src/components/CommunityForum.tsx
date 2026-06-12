import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, ThumbsUp, ThumbsDown, Eye, MessageCircle, Plus, X,
  ShieldCheck, Tag, Search, ChevronUp, ChevronDown, Award, Clock, User
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
interface ForumQuestion {
  id: string;
  title: string;
  body: string;
  author: string;
  authorRole: "user" | "berber";
  tags: string[];
  upvotes: number;
  downvotes: number;
  views: number;
  answerCount: number;
  createdAt: string;
  answers: ForumAnswer[];
}

interface ForumAnswer {
  id: string;
  body: string;
  author: string;
  authorRole: "user" | "berber";
  upvotes: number;
  createdAt: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────
const MOCK_QUESTIONS: ForumQuestion[] = [
  {
    id: "q1",
    title: "Saç dökülmesini yavaşlatmanın en etkili yolu nedir?",
    body: "Son birkaç aydır yoğun saç dökülmesi yaşıyorum. Doğal yollarla bu durumu nasıl kontrol altına alabilirim?",
    author: "Emre K.",
    authorRole: "user",
    tags: ["Saç Dökülmesi", "Doğal Bakım"],
    upvotes: 42,
    downvotes: 2,
    views: 1243,
    answerCount: 3,
    createdAt: "2 saat önce",
    answers: [
      {
        id: "a1",
        body: "Saç dökülmesi genellikle stres, beslenme eksikliği veya hormonal nedenlerden kaynaklanır. Öncelikle bir dermatoloğa görünmenizi öneriyorum. Ev bakımı olarak haftada 2 kez argan yağı ile saç derisine masaj yapabilirsiniz. Biotin takviyesi de oldukça etkilidir.",
        author: "Mehmet Usta",
        authorRole: "berber",
        upvotes: 28,
        createdAt: "1 saat önce",
      },
      {
        id: "a2",
        body: "Ben de aynı sorunu yaşadım. Kafein içerikli şampuan kullanmaya başladıktan sonra gözle görülür azalma oldu.",
        author: "Ali V.",
        authorRole: "user",
        upvotes: 8,
        createdAt: "45 dk önce",
      },
      {
        id: "a3",
        body: "20 yıllık berber olarak söyleyebilirim ki en önemli şey saç derisinin pH dengesini korumaktır. Sülfatsız şampuanlar tercih edin ve saçınızı her gün yıkamaktan kaçının.",
        author: "Burak Berber",
        authorRole: "berber",
        upvotes: 35,
        createdAt: "30 dk önce",
      },
    ],
  },
  {
    id: "q2",
    title: "Kısa saçlara en uygun sakal modeli hangisidir?",
    body: "Crew cut yaptırdım. Buna uygun bir sakal stili önerebilir misiniz?",
    author: "Can Ö.",
    authorRole: "user",
    tags: ["Sakal", "Stil Önerisi"],
    upvotes: 27,
    downvotes: 1,
    views: 876,
    answerCount: 2,
    createdAt: "5 saat önce",
    answers: [
      {
        id: "a4",
        body: "Crew cut ile en iyi uyum sağlayan sakal modeli 'Short Boxed Beard'dır. Yanları kısa tutup çene hattını belirginleştiren bir kesim, yüzünüze ciddi ve bakımlı bir hava katar.",
        author: "Kaya Usta",
        authorRole: "berber",
        upvotes: 19,
        createdAt: "4 saat önce",
      },
      {
        id: "a5",
        body: "Stubble (3 günlük sakal) da çok iyi duruyor. Bakımı da çok kolay.",
        author: "Serkan B.",
        authorRole: "user",
        upvotes: 7,
        createdAt: "3 saat önce",
      },
    ],
  },
  {
    id: "q3",
    title: "Kıvırcık saçlar için en iyi bakım rutini nedir?",
    body: "Kıvırcık saçlarım çok kabarıyor ve şekilsiz duruyor. Profesyonel bakım önerileriniz nelerdir?",
    author: "Deniz A.",
    authorRole: "user",
    tags: ["Kıvırcık Saç", "Bakım Rutini"],
    upvotes: 55,
    downvotes: 0,
    views: 2108,
    answerCount: 1,
    createdAt: "1 gün önce",
    answers: [
      {
        id: "a6",
        body: "Kıvırcık saç bakımının 3 altın kuralı: 1) CG (Curly Girl) methodunu uygulayın — sülfatsız şampuan, silikon içermeyen kremler. 2) Saçınızı havluyla kurulamayın, pamuklu tişört ile sıkın. 3) Leave-in conditioner mutlaka kullanın.",
        author: "Ahmet Berber",
        authorRole: "berber",
        upvotes: 41,
        createdAt: "20 saat önce",
      },
    ],
  },
];

const ALL_TAGS = ["Tümü", "Saç Dökülmesi", "Sakal", "Stil Önerisi", "Doğal Bakım", "Kıvırcık Saç", "Bakım Rutini"];

// ─── Main Component ───────────────────────────────────────────────────
export default function CommunityForum() {
  const [selectedTag, setSelectedTag] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const filteredQuestions = MOCK_QUESTIONS.filter((q) => {
    const matchesTag = selectedTag === "Tümü" || q.tags.includes(selectedTag);
    const matchesSearch =
      !searchQuery ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-extrabold uppercase tracking-widest">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Topluluk Forumu</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Saç & Sakal <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-300">Topluluğu</span>
            </h1>
            <p className="text-sm text-[#a1a1aa] font-semibold max-w-lg">
              Saç bakımı, sakal stilleri ve grooming hakkında sorular sorun, uzman berberlerden doğrulanmış yanıtlar alın.
            </p>
          </div>

          <button
            onClick={() => setShowNewQuestionModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-500 to-violet-400 hover:from-violet-400 hover:to-violet-300 text-white font-extrabold text-xs rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-violet-500/15 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Soru Sor
          </button>
        </div>
      </motion.div>

      {/* Search & Tags */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" />
          <input
            type="text"
            placeholder="Sorularda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-[#111113] border border-white/5 rounded-2xl text-xs text-white placeholder-[#3f3f46] focus:border-violet-500/30 focus:outline-none transition-colors"
          />
        </div>

        {/* Tags Filter */}
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-violet-500/15 border border-violet-500/30 text-violet-400"
                  : "bg-[#111113] border border-white/5 text-[#a1a1aa] hover:border-violet-500/20"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question, idx) => {
          const isExpanded = expandedQuestion === question.id;
          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-violet-500/20 transition-all duration-300"
            >
              {/* Question Header */}
              <div
                className="p-6 cursor-pointer group"
                onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
              >
                <div className="flex gap-5">
                  {/* Vote Column */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-[#52525b] hover:text-violet-400 transition-colors cursor-pointer"
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-extrabold text-white">{question.upvotes - question.downvotes}</span>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-[#52525b] hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3 min-w-0">
                    <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors leading-snug">
                      {question.title}
                    </h3>
                    <p className="text-xs text-[#a1a1aa] font-medium leading-relaxed line-clamp-2">{question.body}</p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#52525b] font-bold">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className={question.authorRole === "berber" ? "text-[#c5a880]" : ""}>{question.author}</span>
                        {question.authorRole === "berber" && (
                          <span className="ml-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] text-[7px] font-extrabold uppercase tracking-wider">
                            <Award className="w-2 h-2" /> Berber
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {question.createdAt}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {question.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {question.answerCount} yanıt
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {question.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-500/5 border border-violet-500/10 text-violet-400 text-[8px] font-bold uppercase tracking-wider">
                          <Tag className="w-2 h-2" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Answers (Expandable) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[#2a2a2e]/30 px-6 py-5 space-y-4 ml-16">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#52525b]">
                        {question.answers.length} Yanıt
                      </h4>

                      {question.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            answer.authorRole === "berber"
                              ? "bg-[#c5a880]/5 border-[#c5a880]/15"
                              : "bg-[#111113]/60 border-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[8px] font-extrabold shrink-0 ${
                              answer.authorRole === "berber"
                                ? "bg-[#c5a880]/15 border border-[#c5a880]/20 text-[#c5a880]"
                                : "bg-[#18181b] border border-white/5 text-[#52525b]"
                            }`}>
                              {answer.author.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-xs font-bold text-white">{answer.author}</span>
                            {answer.authorRole === "berber" && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] text-[7px] font-extrabold uppercase">
                                <ShieldCheck className="w-2.5 h-2.5" /> Doğrulanmış Berber
                              </span>
                            )}
                            <span className="text-[9px] text-[#3f3f46] font-semibold ml-auto">{answer.createdAt}</span>
                          </div>
                          <p className="text-xs text-[#a1a1aa] font-medium leading-relaxed">{answer.body}</p>
                          <div className="flex items-center gap-3 mt-3 pt-2 border-t border-[#2a2a2e]/20">
                            <button className="flex items-center gap-1 text-[9px] font-bold text-[#52525b] hover:text-violet-400 transition-colors cursor-pointer">
                              <ThumbsUp className="w-3 h-3" /> {answer.upvotes}
                            </button>
                            <button className="flex items-center gap-1 text-[9px] font-bold text-[#52525b] hover:text-red-400 transition-colors cursor-pointer">
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="bg-[#111113]/50 border border-dashed border-[#2a2a2e]/50 rounded-3xl py-16 flex flex-col items-center justify-center text-center">
            <MessageSquare className="w-10 h-10 text-[#2a2a2e] mb-3" />
            <p className="text-sm font-bold text-[#3f3f46]">Sonuç bulunamadı.</p>
            <p className="text-[10px] text-[#2a2a2e] font-semibold mt-1">Farklı bir arama terimi veya etiket deneyin.</p>
          </div>
        )}
      </div>

      {/* New Question Modal */}
      <AnimatePresence>
        {showNewQuestionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewQuestionModal(false)} />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#111113] border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Yeni Soru Sor</h2>
                <button
                  onClick={() => setShowNewQuestionModal(false)}
                  className="p-2 rounded-xl hover:bg-[#18181b] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-[#52525b]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#52525b] mb-2 block">Başlık</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Sorunuzu özetleyin..."
                    className="w-full px-4 py-3 bg-[#09090b] border border-white/5 rounded-xl text-xs text-white placeholder-[#3f3f46] focus:border-violet-500/30 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#52525b] mb-2 block">Açıklama</label>
                  <textarea
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    placeholder="Sorunuzu detaylandırın..."
                    rows={4}
                    className="w-full px-4 py-3 bg-[#09090b] border border-white/5 rounded-xl text-xs text-white placeholder-[#3f3f46] focus:border-violet-500/30 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNewQuestionModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#18181b] border border-white/5 text-xs font-bold text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  onClick={() => setShowNewQuestionModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-400 text-white text-xs font-extrabold transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Yayınla
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
