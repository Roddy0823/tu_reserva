import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, TrendingUp, Scissors, User } from "lucide-react";
import { useState } from "react";

interface RankingItem {
  id: string;
  name: string;
  value: number;
  change: number;
  avatar?: string;
  category?: string;
}

interface TopRankingsProps {
  services: RankingItem[];
  staff: RankingItem[];
  clients: RankingItem[];
}

const TopRankings = ({ services, staff, clients }: TopRankingsProps) => {
  const [selectedRanking, setSelectedRanking] = useState<'services' | 'staff' | 'clients'>('services');
  const [topCount, setTopCount] = useState<3 | 5 | 10>(5);

  const getRankingData = () => {
    switch (selectedRanking) {
      case 'services':
        return {
          data: services.slice(0, topCount),
          title: 'Servicios Más Solicitados',
          icon: Scissors,
          valueLabel: 'citas',
          valueFormatter: (val: number) => `${val} citas`
        };
      case 'staff':
        return {
          data: staff.slice(0, topCount),
          title: 'Personal Destacado',
          icon: Star,
          valueLabel: 'rating',
          valueFormatter: (val: number) => `${val.toFixed(1)} ★`
        };
      case 'clients':
        return {
          data: clients.slice(0, topCount),
          title: 'Clientes Más Frecuentes',
          icon: User,
          valueLabel: 'visitas',
          valueFormatter: (val: number) => `${val} visitas`
        };
      default:
        return {
          data: [],
          title: '',
          icon: Trophy,
          valueLabel: '',
          valueFormatter: (val: number) => val.toString()
        };
    }
  };

  const ranking = getRankingData();
  const IconComponent = ranking.icon;
  const maxValue = Math.max(...ranking.data.map(item => item.value));

  const getRankingPosition = (index: number) => {
    switch (index) {
      case 0:
        return { emoji: '🥇', color: 'text-yellow-600' };
      case 1:
        return { emoji: '🥈', color: 'text-gray-500' };
      case 2:
        return { emoji: '🥉', color: 'text-amber-600' };
      default:
        return { emoji: `${index + 1}°`, color: 'text-muted-foreground' };
    }
  };

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconComponent className="h-5 w-5 text-primary" />
              {ranking.title}
            </CardTitle>
            <CardDescription>
              Top {topCount} de este mes
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedRanking} onValueChange={(value: any) => setSelectedRanking(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="services">Servicios</SelectItem>
                <SelectItem value="staff">Personal</SelectItem>
                <SelectItem value="clients">Clientes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={topCount.toString()} onValueChange={(value) => setTopCount(Number(value) as 3 | 5 | 10)}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Top 3</SelectItem>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="10">Top 10</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ranking.data.map((item, index) => {
            const position = getRankingPosition(index);
            const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                <div className={`text-lg font-bold ${position.color} min-w-[2rem] text-center`}>
                  {position.emoji}
                </div>
                
                {selectedRanking !== 'services' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.avatar} />
                    <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{ranking.valueFormatter(item.value)}</span>
                      {item.change !== 0 && (
                        <Badge 
                          variant={item.change > 0 ? "default" : "destructive"} 
                          className="text-xs px-1 py-0"
                        >
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {item.category && (
                    <p className="text-xs text-muted-foreground mb-1">{item.category}</p>
                  )}
                  
                  <Progress value={percentage} className="h-1.5" />
                </div>
              </div>
            );
          })}
          
          {ranking.data.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay datos suficientes para mostrar rankings</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopRankings;