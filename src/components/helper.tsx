const getSkillStyle = (index: number) => {
  const styles = [
    { bg: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800", dot: "bg-blue-400" },
    { bg: "bg-violet-50 text-violet-900 border-violet-200 dark:bg-violet-950/50 dark:text-violet-200 dark:border-violet-800", dot: "bg-violet-400" },
    { bg: "bg-teal-50 text-teal-900 border-teal-200 dark:bg-teal-950/50 dark:text-teal-200 dark:border-teal-800", dot: "bg-teal-400" },
    { bg: "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800", dot: "bg-amber-400" },
    { bg: "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-800", dot: "bg-rose-400" },
  ];
  return styles[index % styles.length];
};
