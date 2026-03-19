import sys

# Replace chapterLeaderApi.ts
api_path = r'c:\Users\manmi\Desktop\Macbease\Integration-\frontend\src\api\chapterLeader.ts'
with open(api_path, 'r', encoding='utf-8') as f:
    api_content = f.read()

api_content = api_content.replace(
'''export const chapterLeaderApi = {
  getQuestsProgress: async (category?: string) => {
    return await axiosPrivate.get(`/chapterLeader/getQuestsProgress?category=${category}`);
  }
};''',
'''export const chapterLeaderApi = {
  getQuestsProgress: async (category?: string) => {
    return await axiosPrivate.get(`/chapterLeader/getQuestsProgress?category=${category}`);
  },
  claimQuestReward: async (questId: string) => {
    return await axiosPrivate.post(`/chapterLeader/claimQuestReward`, { questId });
  }
};''')

with open(api_path, 'w', encoding='utf-8') as f:
    f.write(api_content)


# Replace Club.tsx
club_path = r'c:\Users\manmi\Desktop\Macbease\Integration-\frontend\src\features\chapterleader\pages\Club.tsx'
with open(club_path, 'r', encoding='utf-8') as f:
    club_content = f.read()

# 1. Update Quest Interface
old_quest_interface = '''interface Quest {
  id: string;
  name: string;
  task: string;
  reward: string;
  badge?: string;
  progress: number;
  total: number;
  icon: React.ReactNode;
  lottieData?: any;
}'''

new_quest_interface = '''interface Quest {
  id: string;
  name: string;
  task: string;
  reward: string;
  badge?: string;
  progress: number;
  total: number;
  isCompleted?: boolean;
  isRewardClaimed?: boolean;
  icon: React.ReactNode;
  lottieData?: any;
}'''

club_content = club_content.replace(old_quest_interface, new_quest_interface)

# 2. Add claimingId state and handleClaimReward
old_state = '''  const [stages, setStages] = useState<Stage[]>([]); // Start with empty array for dynamic rendering
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {'''

new_state = '''  const [stages, setStages] = useState<Stage[]>([]); // Start with empty array for dynamic rendering
  const [dbLoading, setDbLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaimReward = async (questId: string) => {
    try {
      setClaimingId(questId);
      const res = await chapterLeaderApi.claimQuestReward(questId);
      if (res.data?.success || res.status === 200 || res.status === 201) {
        setStages(prevStages => prevStages.map(stage => ({
          ...stage,
          quests: stage.quests.map(quest => 
            quest.id === questId ? { ...quest, isRewardClaimed: true, isCompleted: true } : quest
          )
        })));
      }
    } catch (error) {
      console.error("Failed to claim reward:", error);
    } finally {
      setClaimingId(null);
    }
  };

  useEffect(() => {'''

club_content = club_content.replace(old_state, new_state)

# 3. Update mapped quests
old_mapped_quests = '''                  return {
                    id: q.questId || String(qIdx),
                    name: q.title || `Quest ${qIdx + 1}`,
                    task: q.description || "",
                    reward: q.ip ? `+${q.ip} IP` : "+100 IP",
                    progress: currentVal,
                    total: targetVal,
                    icon: <FaMedal />,
                    lottieData: null
                  };'''

new_mapped_quests = '''                  return {
                    id: q.questId || String(qIdx),
                    name: q.title || `Quest ${qIdx + 1}`,
                    task: q.description || "",
                    reward: q.ip ? `+${q.ip} IP` : "+100 IP",
                    progress: currentVal,
                    total: targetVal,
                    isCompleted: q.isCompleted || false,
                    isRewardClaimed: q.isRewardClaimed || false,
                    icon: <FaMedal />,
                    lottieData: null
                  };'''

club_content = club_content.replace(old_mapped_quests, new_mapped_quests)


# 4. Update the isCompleted constant
old_is_completed = '''                const isCompleted = quest.progress >= quest.total;
                const isEven = qIdx % 2 === 0;'''

new_is_completed = '''                const isCompleted = quest.isCompleted || quest.progress >= quest.total;
                const isEven = qIdx % 2 === 0;'''

club_content = club_content.replace(old_is_completed, new_is_completed)

# 5. Update Reward Button
old_reward_btn = '''                          {/* Reward Badge */}
                          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex flex-col text-left">
                              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                Reward
                              </span>
                              <span className="text-yellow-400 font-black text-sm">
                                {quest.reward}
                              </span>
                            </div>
                            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase rounded-xl transition-all shadow-lg active:scale-95">
                              Start
                            </button>
                          </div>'''

new_reward_btn = '''                          {/* Reward Badge */}
                          <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex flex-col text-left">
                              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                Reward
                              </span>
                              <span className="text-yellow-400 font-black text-sm">
                                {quest.reward}
                              </span>
                            </div>
                            
                            <div className="shrink-0 flex items-center justify-center pointer-events-auto z-10">
                              {isCompleted ? (
                                quest.isRewardClaimed ? (
                                  <div className="px-5 py-2.5 bg-green-500/20 text-green-400 border border-green-500/30 text-[11px] font-black uppercase rounded-xl shadow-lg flex items-center justify-center gap-1.5 min-w-[100px]">
                                    <IoIosCheckmarkCircle className="text-sm" /> Claimed
                                  </div>
                                ) : (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleClaimReward(quest.id); }}
                                    disabled={claimingId === quest.id}
                                    className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black text-[11px] font-black uppercase rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 min-w-[100px]"
                                  >
                                    {claimingId === quest.id ? "..." : "Claim IP"}
                                  </button>
                                )
                              ) : (
                                <div className="px-5 py-2.5 bg-white/5 text-gray-400 border border-white/10 text-[11px] font-black uppercase rounded-xl shadow-none min-w-[100px] text-center">
                                  In Progress
                                </div>
                              )}
                            </div>
                          </div>'''

club_content = club_content.replace(old_reward_btn, new_reward_btn)

with open(club_path, 'w', encoding='utf-8') as f:
    f.write(club_content)

print("Done")
