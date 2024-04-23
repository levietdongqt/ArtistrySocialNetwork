'use client'
import { AnimatePresence, motion } from 'framer-motion';
import { getStatsMove } from '@lib/utils';
import { formatNumber } from '@lib/date';

type NumberStatsProps = {
  move: number;
  stats: number;
  alwaysShowStats?: boolean;
};

export function NumberStats({
  move,
  stats,
  alwaysShowStats
}: NumberStatsProps): JSX.Element {
  return (
    <div className='overflow-hidden'>
      <AnimatePresence mode='wait' initial={false}>
        {(alwaysShowStats || !!stats) && (
          <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01]
              }}
              className='text-sm' {...getStatsMove(move)} key={stats}>
            {formatNumber(stats)}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
