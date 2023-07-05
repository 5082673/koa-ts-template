import schedule from 'node-schedule';
/**
 * 定时任务
 */
/** 定义规则,cron表达式*/
// *  *  *  *  *  *
// ┬ ┬ ┬ ┬ ┬ ┬
// │ │ │ │ │  |
// │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
// │ │ │ │ └───── month (1 - 12)
// │ │ │ └────────── day of month (1 - 31)
// │ │ └─────────────── hour (0 - 23)
// │ └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
const rule = new schedule.RecurrenceRule();
/**每天的凌晨2点去做点啥*/
rule.hour = 14;
rule.minute = 29;
rule.second = 0;
/**启动任务*/
schedule.scheduleJob(rule, () => {
  console.log('做点什么');
});
/**每周1凌晨1点1分执行清理任务*/
schedule.scheduleJob('0 1 1 * * 1', () => {
  console.log('做点什么');
});
