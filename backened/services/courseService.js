function generateMockCourse(topic) {
  const t = topic.trim();
  return {
    title: `${t} — Quick Course (Prototype)`,
    description: `A short prototype course automatically generated for "${t}".`,
    modules: [
      {
        title: "Module 1: Foundations",
        lessons: [`${t} Basics`, `${t} Setup`, `${t} Hello World`],
      },
      {
        title: "Module 2: Core Concepts",
        lessons: [`${t} Key Ideas`, `${t} Hands-on`, `${t} Examples`],
      },
      {
        title: "Module 3: Applications",
        lessons: [`${t} in Practice`, `${t} Projects`, `${t} Next Steps`],
      },
    ],
  };
}

module.exports = { generateMockCourse };
