/* ==========================================================================
   COURSE CONTENT — this is the file to edit.

   Everything the learner reads, hears and clicks lives here. Change the text
   between the quote marks, save, and refresh the browser.

   ADDING THINGS LATER
   - Narration:  put the audio file in assets/audio and write its path in
                 audio: '',  e.g.  audio: 'assets/audio/intro.mp3'
   - Videos:     put the file in assets/video and write its path in  src: ''
   - Downloads:  put the file in assets/downloads and write its path in  url: ''
   - Web links:  paste the full address into  url: ''
   Anything left empty still shows on the page, marked "to be added".

   TIPS
   - Keep the commas and brackets as they are.
   - Text can include <strong>bold</strong>, <em>italic</em> and
     <span class="hl">green highlight</span>.
   - settings.reviewMode: true unlocks every Next button while you check pages.
   ========================================================================== */

window.COURSE = {
  title: 'Mastering The UAE Labour Law',
  brand: 'The UAE<br>Labour Law',

  settings: {
    lockNavigation: true,   // Next stays locked until each page's activity is done
    minAnswerLength: 10,    // typed answers must be at least this many characters before Next unlocks
    reviewMode: false       // true = everything unlocked (for checking pages)
  },

  modules: [
    /* ------------------------------------------------------------------ */
    {
      title: 'Introduction',
      // shown in the menu as plain page links (no section heading, no ticks) and not counted in course progress
      flat: true,
      pages: [
        {
          id: 'title',
          type: 'title',
          title: 'Mastering The UAE Labour Law',
          heading: 'Mastering<br>The UAE<br>Labour Law',
          button: 'Enter',
          background: 'assets/images/title-bg.jpg'
        },
        {
          id: 'in-the-news',
          type: 'newspaper',
          title: 'Introduction',
          image: 'assets/images/newspaper.png',
          alt: 'Newspaper headline: UAE firm fails to formally fire employee; ordered to pay Dh875,700 in unpaid salaries',
          narration: {
            audio: 'assets/audio/in-the-news.mp3',
            untilEnd: true,   // storyboard: Next unlocks only when the voice-over has finished
            text: 'All this cost, for someone who had been on probation. How could this have happened? Unfortunately, this is not an isolated incident, and you may have already heard of such cases costing the company money. Fortunately, you have chosen this course. By taking this course, you will be better equipped to protect yourself, the employees and your company from being out of compliance with federal law.'
          }
        },
        {
          id: 'objectives',
          type: 'objectives',
          menu: false,            // still part of the course, just not listed in the menu
          title: 'Learning Objectives and Outcomes',
          image: 'assets/images/sarah-thinking.png',
          narration: {
            audio: 'assets/audio/objectives.mp3',
            text: 'This course is not just about knowledge of the labour law but real application. The key directive being: make your decisions based on what the law says and not what someone else says. Use the law along with evidence to back up your decisions and actions. Select the course objectives and course outcomes buttons to see how you will achieve this.'
          },
          lists: [
            {
              label: 'Course Objectives',
              items: [
                'Navigate the UAE Labour Law',
                'Understand the different legal jurisdictions',
                'Connect the law to the workplace',
                'Interpret legal articles',
                'Make workplace decisions',
                'Gather documentation and evidence.',
                'Review changes to the law'
              ]
            },
            {
              label: 'Course Outcomes',
              items: [
                'Identify correct legal jurisdictions',
                'Use relevant articles of law',
                'Identify non-compliance',
                'Apply a five-step process to problems',
                'Resolve conflicts between legal requirements and company policy.',
                'Gather evidence'
              ]
            }
          ]
        },
        {
          id: 'choose-path',
          type: 'choosePath',
          title: 'Course Outline: Choose Your Path',
          image: 'assets/images/signpost.png',
          narration: {
            audio: 'assets/audio/choose-path.mp3',
            auto: false,
            text: 'There are two paths through this course. Select a path to find out more about each.'
          },
          pathA: {
            label: 'Path A',
            image: 'assets/images/path-a-preview.png',
            text: 'Understand the Labour Law with help from Sarah the Labour Law Guru. She will take you through the articles to teach you how it works on the job.'
          },
          pathB: {
            label: 'Path B',
            image: '',
            text: 'Learn about the Labour Law by taking the role of an HR employee. Use your skill and critical thinking to solve problems based on day-to-day workplace problems.'
          }
        }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      title: 'Introduction to the Labour Law',
      path: 'A',
      single: true,   // one menu line for the whole section, ticked once all its pages are done
      pages: [
        {
          id: 'meet-sarah',
          type: 'iconLayers',
          title: 'Introduction to the Labour Law',
          scene: 'assets/images/sarah-desk.png',
          narration: {
            audio: 'assets/audio/meet-sarah.mp3',
            text: 'Hi, my name is Sarah and I’m your resident labour law guru who will guide you through this course. To start I want to make a few things clear. The law is not static; it is always changing and updating. What was considered correct yesterday may not be the case today. I advise you to stay up to date through different platforms: the MoHRE website, press announcements or official social media platforms. Or you can follow me on LinkedIn.'
          },
          prompt: 'Select an icon',
          icons: [
            {
              id: 'mohre',
              label: 'MoHRE website',
              icon: 'assets/images/mohre-logo.png',
              layer: {
                image: 'assets/images/mohre-logo.png',
                text: 'You can view the latest announcements and circulars directly on the MoHRE Media Centre page.',
                screenshots: ['assets/images/mohre-media-centre.png'],
                links: [{ label: 'Open the MoHRE Media Centre', url: 'https://www.mohre.gov.ae/en/media-center/news' }]
              }
            },
            {
              id: 'social',
              label: 'MoHRE social media',
              icon: 'assets/images/social-icons.png',
              layer: {
                image: 'assets/images/social-icons.png',
                text: 'The official social media links for MoHRE share updates, labour guidelines and promote awareness campaigns.',
                screenshots: ['assets/images/mohre-x.png', 'assets/images/mohre-twitter.png', 'assets/images/mohre-instagram.png'],
                links: [
                  { label: 'X', url: 'https://x.com/MOHRE_UAE' },
                  { label: 'Instagram', url: 'https://www.instagram.com/mohre_uae/' },
                  { label: 'YouTube', url: 'https://www.youtube.com/user/MOLUAE' },
                  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/mohre/' },
                  { label: 'WhatsApp', url: 'https://wa.me/971600590000' },
                  { label: 'Facebook', url: 'https://www.facebook.com/MOHREUAE/' }
                ]
              }
            },
            {
              id: 'linkedin',
              label: 'Follow Sarah on LinkedIn',
              icon: 'assets/images/linkedin-logo.jpg',
              layer: {
                image: 'assets/images/linkedin-logo.jpg',
                text: 'Follow Sarah on LinkedIn for updates on UAE employment law and HR practice.',
                screenshots: ['assets/images/sarah-linkedin.png'],
                links: [{ label: 'Follow Sarah on LinkedIn', url: 'https://www.linkedin.com/in/sarahbrooks-hr-passionate/' }]
              }
            }
          ]
        },
        {
          id: 'get-the-law',
          type: 'resources',
          title: 'Introduction to the Labour Law',
          scene: 'assets/images/sarah-desk.png',
          narration: {
            audio: 'assets/audio/get-the-law.mp3',
            text: 'Make your decisions based on what the law says and not what someone else says, such as your colleagues or previously inherited procedures. Stay up to date, be current, or there will be problems. You will need to download a copy of the current labour law and read it. You can do that through the link on this page if you are a mainland company or free zone. If you are part of DIFC or ADGM this course is not for you. The laws are different and you will need to get a copy of their labour law through those entities.'
          },
          download: {
            image: 'assets/images/law-cover.png',
            label: 'Download the Labour Law',
            url: 'https://www.mohre.gov.ae/assets/download/95c227da/Federal%20Decree-Law%20No.%2033%20of%202021%20Regarding%20the%20Regulation%20of%20Employment%20Relationship%20and%20its%20amendments_638990571068264034.pdf.aspx'
          },
          website: { label: 'Labour law website link', url: 'https://www.mohre.gov.ae/en/home' }
        }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      title: 'Module 1',
      path: 'A',
      pathTag: false,   // don't show the PATH A label on this menu heading
      // several pages shown as one menu line: links to `link`, ticked once every page in the group is done
      menuGroups: [
        { label: 'Which Jurisdiction?', link: 'lina-and-anita', pages: ['lina-and-anita', 'which-jurisdiction', 'jurisdiction-steps', 'decision-tree'] },
        { label: 'The Framework', link: 'missing-lina', pages: ['missing-lina', 'how-it-works', 'four-layers', 'who-wins-1', 'who-wins-2', 'remember'] },
        { label: 'The Law', link: 'company-policy', pages: ['company-policy', 'understanding-the-law'] },
        { label: 'Systems', link: 'enforcer', pages: ['enforcer', 'risky-items'] },
        { label: 'Internal Governance', link: 'internal-governance', pages: ['internal-governance', 'inside-the-company', 'law-and-policy', 'example', 'lina-continued-1'] },
        { label: 'Contracts & The Labour Market', link: 'contracts', pages: ['contracts', 'emiratisation'] },
        { label: 'The Verdict', link: 'lina-continued-2', pages: ['lina-continued-2', 'what-do-you-think', 'case-summary'] },
        // lockUntilDone: stays locked in the menu until every earlier page in the course is complete
        { label: 'Assessment', link: 'assessment', pages: ['assessment', 'checklist'], lockUntilDone: true, lockedTip: 'Complete all sections to unlock' }
      ],
      pages: [
        {
          id: 'framework',
          type: 'organiser',
          title: 'Module Outline',
          image: 'assets/images/framework-organiser.png',
          alt: 'The Framework: Jurisdictions, The Framework (The Law, Systems, Internal Governance), The Labour Market, Record Keeping',
          character: 'assets/images/sarah-standing.png',
          narration: {
            audio: 'assets/audio/framework.mp3',
            text: 'In this module we will look at how the Labour Law works, what and who makes it work, and some basic ways we can show we are working within it. In this section we will determine which contract rules win when company policy and law clash; identify the correct jurisdiction for a UAE-based worker; use mandatory platforms (WPS, Nafis, MOHRE) without triggering penalties; and keep bulletproof HR records to defend against labour disputes.'
          }
        },
        {
          id: 'lina-and-anita',
          type: 'video',
          title: 'Lina and Anita',
          video: { src: 'assets/video/lina-and-anita.mp4', poster: '' },
          notes: 'Lina and Anita work for Danity Global Holdings (DGH). Same job title, different departments. Both have a dispute with DGH; we follow one. Decide who and explain why. Answer: Lina — her company is under a free zone that applies mainland federal employment law.'
        },
        {
          id: 'which-jurisdiction',
          type: 'speech',
          title: 'Which Jurisdiction?',
          character: 'assets/images/sarah-standing.png',
          bubble: 'How could we identify Lina’s jurisdiction without looking at the trade license?'
        },
        {
          id: 'jurisdiction-steps',
          type: 'flipCards',
          style: 'number',
          title: 'Which Jurisdiction?',
          intro: '3 steps to identify an employee’s jurisdiction. Select each number.',
          cards: [
            { front: '1', label: 'Visa', heading: 'Check your visa.', text: 'Look at the digital visa or labour card to find the <strong>employer’s exact legal entity name</strong>.' },
            { front: '2', label: 'Suffix', heading: 'Check the company suffix.', text: 'Ends in <strong>LLC</strong>: you are in the <strong>Mainland jurisdiction</strong> (regulated by the Department of Economy and Tourism / DED).<br>Ends in <strong>FZE</strong> or <strong>FZ-LLC</strong>: you are in a <strong>Free Zone jurisdiction</strong>.' },
            { front: '3', label: 'Location', heading: 'Find the Financial Free Zone location.', sub: '(A free zone finance company dealing in regulations, insurance, or advisory services)', text: '<strong>Dubai-based:</strong> you are in the <strong>DIFC</strong> (regulated by the DFSA).<br><strong>Abu Dhabi-based:</strong> you are in the <strong>ADGM</strong> (regulated by the FSRA).' }
          ]
        },
        {
          id: 'decision-tree',
          type: 'speech',
          title: 'Which Jurisdiction?',
          character: 'assets/images/sarah-standing.png',
          bubble: 'DIFC and ADGM are separate. They are financial free zones that are based on English common law. They have separate law courts and end of service schemes.<br><br>I’m giving you a jurisdiction decision tree you can use on the job.',
          download: { label: 'Download the jurisdiction decision tree', url: 'assets/downloads/UAE%20Employee%20Jurisdiction.pdf' }
        },
        {
          id: 'missing-lina',
          type: 'video',
          title: 'The Lingering Case of the Missing Lina (Part 1): How it Started',
          video: { src: 'assets/video/missing-lina.mp4', poster: '' },
          notes: 'Lina stopped showing up for work 6 weeks ago. Her manager WhatsApps Roshan: “She’s gone. Remove her from payroll.” What should you and Roshan do? Before HR can decide what process to follow, they need to confirm which entity employs Lina and which rules apply.'
        },
        {
          id: 'how-it-works',
          type: 'scene',
          title: 'How does it all work?',
          image: 'assets/images/framework-intro.png',
          // morph into the next page: the picture is split where the indigo panel starts (49.64% across)
          // so each half can glide into its place on the 4 Layered Network page
          morph: { to: 'four-layers', split: 49.64 },
          alt: 'Sarah at her desk. The Framework – 4 layered network',
          speaker: { x: 34, y: 12 },
          narration: {
            audio: 'assets/audio/how-it-works.mp3',
            text: 'The framework is how all the laws, rules, court decisions and enforcement groups combine to build a structured network. This network dictates how employers and employees behave towards each other.'
          }
        },
        {
          id: 'four-layers',
          type: 'pyramid',
          morph: { to: 'how-it-works' },
          title: '4 Layered Network',
          avatar: 'assets/images/sarah-avatar.png',
          monitor: 'assets/images/monitor.png',
          pyramid: 'assets/images/pyramid.png',
          prompt: 'Select a section of the diagram.',
          narration: {
            audio: 'assets/audio/four-layers.mp3',
            text: 'There are 4 layers and if we think of it as an upside-down pyramid, it is easier to see the hierarchy. Select each section.'
          },
          tiers: [
            { title: 'The Law – THE FOUNDATION', text: 'The Federal Decree-Law No. 33 of 2021. These are the legal rights for employers and employees, in areas like minimum rest days, maximum working hours and anti-discrimination rules. These are the minimum standards.' },
            { title: 'The Executive Regulations – THE HOW', text: 'The Executive Regulations and related Cabinet and Ministerial decisions provide the detail needed to put the Labour Law into practice. They explain the conditions, procedures and requirements behind many of the rules contained in the Law.' },
            { title: 'The Regulatory Authorities – THE ENFORCERS', text: 'Entities such as the Ministry of Human Resources and Emiratisation (MOHRE) are overseers. They issue work permits, approve contracts and deal with disputes.' },
            { title: 'Internal Company Policies – THE DAY TO DAY', text: 'Companies create their own workplace policies and procedures covering areas such as conduct, attendance and day-to-day working practices. These internal rules must comply with UAE Labour Law and its regulations. A company can provide employees with more favourable terms, but it cannot use an internal policy to remove a right provided by law.' }
          ]
        },
        {
          id: 'who-wins-1',
          type: 'whoWins',
          title: 'Test of Strength: Who would win?',
          label: 'Question 1',
          question: 'Which rule would win, the company offer letter or the law?',
          options: [
            { title: 'Company offer letter', text: 'You will be on probation for a period of six months which may be extended by a further period at the discretion of the management of the company.' },
            { title: 'The Law', text: 'The employer may appoint the worker under a probationary period not exceeding six months from the date of commencement of work.' }
          ],
          correct: 1,
          feedbackCorrect: 'That’s right. The company cannot extend the probation period beyond six months because the law says it cannot exceed six months.<br>In the hierarchy, the law overrides a company rule that gives the employee less protection.',
          feedbackWrong: 'Not quite. Ask yourself: which rule gives the employee greater protection? A maximum of six months’ probation, or the possibility of the probation period being extended beyond six months?<br><br>The law sets a maximum of six months. A company cannot give an employee less protection than the law allows.',
          takeaway: 'The law is the floor, not the ceiling.'
        },
        {
          id: 'who-wins-2',
          type: 'whoWins',
          title: 'Test of Strength: Who would win?',
          label: 'Question 2',
          question: 'Which rule would win, the employee handbook or the law?',
          options: [
            { title: 'Company employee handbook', text: 'Employees are entitled to a minimum of 98 days fully paid leave for primary caregivers including fathers and adoptive parents. This may be extended to up to 6 months.' },
            { title: 'The Law', text: 'The female worker shall be entitled to a maternity leave of (60) sixty days, 45 days with full wage and 15 days with half wage.' }
          ],
          correct: 0,
          feedbackCorrect: 'That’s right. The company is offering more favourable terms than the minimum required by law, so the company rule applies.<br>Companies can give their employees more rights than the law requires, but they cannot give them less.',
          feedbackWrong: 'Not this time. Ask yourself: which rule is more favourable to the employee? The law provides 60 days of maternity leave, while this company provides a minimum of 98 days’ fully paid leave.<br><br>Remember: a company is allowed to give its employees more favourable rights than the minimum required by law.',
          takeaway: 'The law is the floor, not the ceiling.'
        },
        {
          id: 'remember',
          type: 'scene',
          title: 'Remember',
          image: 'assets/images/sarah-desk.png',
          crop: 'remember',
          alt: 'Sarah at her desk',
          speaker: { x: 20, y: 12 },
          tile: 'The law is the floor,<br>not the ceiling.',
          narration: {
            audio: 'assets/audio/remember.mp3',
            text: 'The law is the floor, not the ceiling. Companies can give their employees more rights than the law requires, but they cannot give them less.'
          }
        },
        {
          id: 'company-policy',
          type: 'video',
          title: 'The Lingering Case of the Missing Lina (Part 2): Company Policy',
          video: { src: 'assets/video/company-policy.mp4', poster: '' },
          reflection: {
            question: 'Roshan has found something in the handbook: 5 consecutive days of unauthorised absence results in automatic termination. Roshan says, “Look, it’s right here! Isn’t that enough to cover ourselves?” What do you think?',
            prompt: 'Write 1 point explaining why or why not.'
          },
          notes: 'Roshan checks the employee handbook while you look through Lina’s file. No absence report, no documented investigation.'
        },
        {
          id: 'understanding-the-law',
          type: 'accordion',
          title: 'The Law: Understanding the Document',
          stripImage: 'assets/images/gavel.jpg',  // one photo, sliced across the five strips
          intro: {
            lead: 'When you first encounter the Labour Law document you might think:',
            questions: ['How long will it take for me to find what I need?', 'If it’s written in Arabic, how will I understand it?', 'How do I interpret what it means for my company?'],
            prompt: 'Select a number to explore the answers to these questions and more.'
          },
          panels: [
            {
              kind: 'translation',
              title: 'Translation',
              image: 'assets/images/arabic-law.png',
              text: 'The Labour Law was originally written in Arabic. The English version is provided to help you understand it, but the Arabic text is the authoritative version.<br><br>If there is any difference in meaning or interpretation, the Arabic prevails.'
            },
            {
              kind: 'journey',
              title: 'Navigation',
              text: '<strong>The law follows the employment journey.</strong><br>Rather than reading 74 articles from beginning to end, think about <strong>where the employee is in their employment journey.</strong> Select each block to find out more.',
              items: [
                { label: 'Definitions and scope', articles: 'articles 1–6', icon: 'assets/images/icon-definitions.png', question: 'Who and what are we talking about?', detail: 'Key terms used throughout the law and who the law applies to.' },
                { label: 'Getting hired and contracts', articles: 'articles 7–16', icon: 'assets/images/icon-hired.png', question: 'How does employment begin?', detail: 'Contracts, work patterns, probation and employer/employee responsibilities.' },
                { label: 'Daily life and money', articles: 'articles 17–26', icon: 'assets/images/icon-daily.png', question: 'What happens during everyday employment?', detail: 'Working hours, wages, overtime, workplace protections and employee obligations.' },
                { label: 'Leaves', articles: 'articles 27–41', icon: 'assets/images/icon-leaves.png', question: 'When can employees be away from work?', detail: 'Annual leave, sick leave, maternity/parental leave, bereavement and other statutory leave.' },
                { label: 'Leaving the company', articles: 'articles 42–53', icon: 'assets/images/icon-leaving.png', question: 'How does employment end?', detail: 'Resignation, termination, notice and end-of-service entitlements.' },
                { label: 'Disputes and fines', articles: 'articles 54–74', icon: 'assets/images/icon-disputes.png', question: 'What happens when things go wrong?', detail: 'Complaints, dispute resolution, inspections, enforcement and penalties.' }
              ],
              tip: 'You don’t need to memorise every article. First identify the issue: hiring, work and pay, leave, leaving, or a dispute. Then find the relevant part of the law.'
            },
            {
              kind: 'boxes',
              title: 'Interpretation',
              boxes: [
                { heading: 'Key definitions', text: 'Article 1 may look like a list of definitions, but it acts as the key for interpreting the rest of the Labour Law. When the law uses a specific term, you need to know exactly what that term includes.<br>For example, the terms<br><strong>Basic wage</strong> = Salary only<br><strong>Wage</strong> = Salary + allowances<br>Same topic, different word and a different calculation.' },
                { heading: 'Executive Regulations', text: 'Cabinet Resolution No. 1 of 2022 provides the Executive Regulations for the Labour Law. It gives additional detail on how many of the provisions in the main law are applied in practice.<br>It sets out conditions, procedures, categories and calculations that help you interpret and implement the Labour Law correctly.' }
              ]
            },
            {
              kind: 'people',
              title: 'Who is the law for?',
              text: '<strong>Employees working in the UAE private sector.</strong><br><br>There are some exceptions not covered by this law. They are instead covered by their own legislation (Article 3 of Federal Decree-Law No. 33 of 2021).',
              people: [
                { label: 'Police and<br>Security Personnel', image: 'assets/images/people-police.png' },
                { label: 'Federal and Local<br>Government Employees', image: 'assets/images/people-government.png' },
                { label: 'Armed<br>Forces', image: 'assets/images/people-armed.png' },
                { label: 'Domestic<br>Workers', image: 'assets/images/people-domestic.png' }
              ],
              remember: '<strong>Remember:</strong> DIFC and ADGM operate under their own employment-law regimes. Use your Jurisdiction Check before applying the Federal Labour Law.'
            },
            {
              kind: 'shields',
              title: 'Equality and Non-discrimination',
              text: 'The law protects employees against discrimination based on',
              grounds: ['Race', 'Colour', 'Religion', 'Sex', 'Disability', 'National or<br>Social Origin'],
              note: 'Rules that support Emiratisation however are not to be considered discriminatory.',
              shields: ['assets/images/shield-gold.png', 'assets/images/shield-indigo.png']
            }
          ]
        },
        {
          id: 'enforcer',
          type: 'video',
          title: 'The Enforcer and Key Compliance Systems',
          video: { src: 'assets/video/enforcer.mp4', poster: '' },
          notes: 'MOHRE oversees; WPS protects wages; Nafis supports Emiratisation; ILOE provides unemployment protection.'
        },
        {
          id: 'risky-items',
          type: 'flipCards',
          style: 'icon',
          title: 'Compliance: 3 Risky Items',
          intro: 'Flip each card to see 3 risky items you must attend to immediately.',
          cards: [
            { icon: 'assets/images/icon-payroll.png', alt: 'Money', text: 'If payroll hasn’t been processed within 15 days of salary due date' },
            { icon: 'assets/images/icon-permit.png', alt: 'Document and stamp', text: 'Work permits or labour cards are approaching expiry' },
            { icon: 'assets/images/icon-exit.png', alt: 'Worker exiting', text: 'Exiting employees’ EOS hasn’t been calculated' }
          ],
          download: { label: 'Download a monthly compliance checker', url: 'assets/downloads/UAE_HR_Compliance_Desk_Sheet.pdf' }
        },
        {
          id: 'internal-governance',
          type: 'zoomScene',
          nextButton: false,   // the Next button stays off: learners move on with the arrow or the building
          nextHint: 'Select the arrow or the building to continue',
          title: 'Internal Governance',
          character: 'assets/images/sarah-arms.png',
          image: 'assets/images/city.png',
          tower: 'assets/images/city-tower.png',  // the building the arrow points at, cut out so it can lift
          prompt: 'Select the arrow to zoom in on one company.',
          narration: {
            audio: 'assets/audio/internal-governance.mp3',
            text: 'Internal governance outlines behaviour, rules and processes for an individual company. At a macro level the law sets out rules and regulations for all within its jurisdiction.'
          }
        },
        {
          id: 'inside-the-company',
          type: 'scene',
          title: 'Internal Governance',
          image: 'assets/images/office zoom backdrop internal governance.gif',
          alt: 'Animated office with people working',
          avatar: 'assets/images/sarah-avatar.png',
          speaker: { x: 15, y: 4 },
          narration: {
            audio: 'assets/audio/inside-the-company.mp3',
            text: 'At a micro level, companies must have their own policies and procedures in alignment with the law that guides behaviours and day-to-day processes. If there is a conflict, the terms that are more favourable to the employee will be applied.'
          }
        },
        {
          id: 'law-and-policy',
          type: 'stack',
          title: 'Internal Governance',
          image: 'assets/images/office-bg.jpg',
          boxes: [
            { heading: 'Law', text: 'Sets the minimum standard.' },
            { heading: 'Company Policy', text: 'Adds the workplace rules.' },
            { heading: 'Conflict', text: 'If there’s a conflict, apply the more favourable terms.' }
          ],
          download: { label: 'Quick HR guide to Article 14 of Cabinet Resolution No. 1 of 2022 (the four core policies)', url: 'assets/downloads/Article%2014%20Quick%20HR%20Guide.pdf' }
        },
        {
          id: 'example',
          type: 'reveal',
          title: 'Example',
          intro: 'Let’s look at an example:',
          boxes: [
            { title: 'Company Handbook', text: 'Employees on probation may be terminated with immediate effect. No notice necessary.' },
            { title: 'Article 9 of the Labour Law', text: 'The employer may [[terminate the service|end the employee’s employment]] of the worker during [[this period|during the probation period]] after [[notifying the latter|telling the employee in writing, not just verbally]] of the same in writing fourteen (14) days at least [[before the date|the written notice must be given at least 14 days before the last working day]] specified for the termination of service.' }
          ],
          questions: [
            'What do you think Article 9 of the Labour Law means? (If you need help, hover over or tap the underlined sections.)',
            'What is the problem with the probationary policy in the company handbook?'
          ],
          button: 'Reveal',
          answer: 'Article 9 explains the notice an employer must give when terminating an employee during probation. The employee must be notified in writing at least 14 days before the termination date.<br><br>The company handbook conflicts with this requirement because it says that an employee on probation can be terminated immediately without notice.',
          takeaway: 'Company policy cannot override the Labour Law.',
          followUp: 'Think about it: what could happen if a company followed its handbook and terminated an employee immediately without giving the required notice?'
        },
        {
          id: 'lina-continued-1',
          type: 'video',
          title: 'The Lingering Case of the Missing Lina (Part 3): Contract Clause',
          video: { src: 'assets/video/lina-continued-1.mp4', poster: '' },
          notes: 'Roshan has checked the employee handbook while you look through her file. No absence report, no documented investigation; handbook says 5 consecutive days of unauthorised absence results in automatic termination.'
        },
        {
          id: 'contracts',
          type: 'tabs',
          title: 'Contracts: There can be only one!',
          character: 'assets/images/sarah-pointing.png',
          prompt: 'Select a tab',
          tabs: [
            {
              label: 'Fixed Term',
              html: '<p>You may have heard of <span class="hl">unlimited contracts</span>. These were open-ended employment contracts with no fixed expiry date.</p><p>But they are now a thing of the past.</p><p>Private-sector employers were required to convert unlimited contracts to <span class="hl">specified-term contracts</span> by 31 December 2023.</p><p>Today, the employer and employee agree the term of the employment contract. Contracts can then be renewed or extended by agreement.</p>'
            },
            {
              label: 'Drafting Contracts',
              intro: 'When setting up an employment contract, these are your essentials:',
              steps: [
                { heading: 'Contract term', text: 'Start date and end date' },
                { heading: 'Work pattern', text: 'Full-time, Part-time, Flexible, Remote, or Temporary' },
                { heading: 'Wages', text: 'Identify the basic wage and any allowances' },
                { heading: 'Probation period', text: 'Maximum 6 months, non-extendable' },
                { heading: 'Notice period', text: 'Normally 30 to 90 days' }
              ]
            },
            {
              label: 'Renewal, Continuity & Expiry',
              html: '<p>Contracts can be renewed or extended for an equal, shorter or longer term before they expire.</p><p class="hl"><strong>Gratuity continues<br>Accumulated statutory leave continues<br>These do not reset</strong></p><p>If the contract expires but both employer and employee simply carry on with the employment relationship, the contract is treated as <span class="hl">implicitly extended on the same conditions</span>.</p>'
            },
            {
              label: 'Work Permit',
              html: '<p><strong>EMPLOYMENT CONTRACT</strong><br>The employment agreement</p><p><strong>WORK PERMIT</strong><br>Government authorisation to work</p><p>Don’t confuse the employment contract with the work permit.</p><p>For example, MOHRE’s standard overseas work permit is currently issued for <span class="hl">two years</span>, but that is an administrative permit period. You will need to keep track of both the employee’s contract and their work permit so neither is allowed to expire unnoticed.</p>'
            }
          ]
        },
        {
          id: 'emiratisation',
          type: 'hotspots',
          title: 'Emiratisation & Nafis',
          image: 'assets/images/emiratisation.jpg',
          alt: 'Emirati professionals working together',
          avatar: 'assets/images/sarah-avatar.png',
          narration: {
            audio: 'assets/audio/emiratisation.mp3',
            text: 'Emiratisation is a UAE Government initiative to increase the number of UAE citizens working in the private sector. It is a major national workforce priority, even though the detailed Emiratisation requirements sit outside the main Labour Law provisions being studied here. Select the hotspots to find out more about Emiratisation.'
          },
          spots: [
            { x: 13.5, y: 57, text: 'Companies with 50+ employees must increase Emirati representation in skilled roles by 2% each year, with the programme designed to reach a 10% rate by the end of 2026.<br>Selected businesses with 20–49 employees in specified sectors are also subject to Emiratisation requirements.' },
            { x: 46.5, y: 48, text: '<strong>Non-compliance has a cost.</strong> Companies that do not meet their required targets can face financial contributions for each required Emirati position that remains unfilled.' },
            { x: 77.6, y: 14, text: 'MOHRE checks whether companies are meeting their targets and can act against non-compliance or fake Emiratisation.' },
            { x: 84, y: 65.6, text: 'Nafis helps connect private-sector employers with Emirati talent and provides support linked to Emiratisation.' }
          ]
        },
        {
          id: 'record-keeping',
          type: 'video',
          title: 'Record Keeping: Accuracy Matters',
          video: { src: 'assets/video/record-keeping.mp4', poster: '' },
          notes: 'Max 2 minutes. Article 13 record keeping; keep records at least 2 years after the employee leaves; verbal agreements have no weight; 3 good habits.'
        },
        {
          id: 'lina-continued-2',
          type: 'video',
          title: 'The Lingering Case of the Missing Lina (Part 4): She’s Back',
          video: { src: 'assets/video/lina-continued-2.mp4', poster: '' },
          notes: 'Meanwhile… Lina’s contract says unauthorised absence of 5 working days will be treated as voluntary resignation. She signed it and the handbook. Roshan: “OK, her work permit is still active, and she still appears as an employee in all the employment records so I will get started on that.”'
        },
        {
          id: 'what-do-you-think',
          type: 'mcq',
          title: 'What Do You Think?',
          question: 'What do you think was the outcome of this case?',
          image: 'assets/images/court.jpg',
          alt: 'Courtroom',
          options: [
            'Lina won her claim for unpaid salary up to the date she filed the case because DGH could not prove an earlier termination date.',
            'Lina won her claim, and what began as several weeks of unpaid salary became a much larger settlement once outstanding leave and end-of-service entitlements were added.',
            'Lina lost her claim because DGH were able to prove abandonment and a trail of work absences in line with the internal policy and contract Lina had agreed to and signed.'
          ],
          correct: [0, 1],
          feedbackCorrect: 'Answer A or B could have been the ending.<br><br>The amount would depend on Lina’s circumstances and the court’s findings.<br><br>Lina would most probably win because DGH cannot prove when Lina’s employment ended.',
          feedbackWrong: 'What evidence can DGH show to prove they had terminated her?<br><br>Think about what needs to happen if someone is terminated or if someone resigns at your workplace. What should happen when there is an investigation? Now consider why DGH are unable to produce any documents proving they ended their working relationship with Lina.',
          gifCorrect: 'assets/images/sarah-correct.gif',
          gifWrong: 'assets/images/sarah-incorrect.gif'
        },
        {
          id: 'case-summary',
          type: 'summary',
          title: 'Case Summary',
          image: 'assets/images/sarah-desk.png',
          narration: {
            audio: 'assets/audio/case-summary.mp3',
            text: 'Lina knew she was not allowed more than 5 unauthorised absences. This is the company rule. She stopped showing up for work and therefore they stopped paying her. The company believed that she no longer worked for them. They could prove that she stopped coming into work, but the law says termination has a process and procedure. If the termination is the result of breaking a rule there should be an investigation and evidence; this didn’t happen. They did not formally dismiss Lina and therefore have no formal record of a termination date.'
          },
          believed: { heading: 'DGH believed:', items: ['Lina stopped coming to work', 'Her employment ended', 'Salary stopped'] },
          law: {
            heading: 'The Law:',
            quote: 'The employer may dismiss the worker without notice after conducting a written investigation with him and the dismissal decision shall be in writing and justified and the employer or its representative shall hand it over to the worker…',
            source: '(Article 44)'
          },
          // the learner's own answer from the Company Policy reflection, shown last
          recall: { from: 'company-policy', heading: 'Your answer to Roshan earlier:', empty: 'You did not write an answer earlier.', followUp: 'Do you still agree with this point? Explain why or why not.',
            // "Check my answer": any of these words in the learner's answer counts as making that point (lower case, partial words allowed)
            keyPoints: [
              { label: 'There was no written investigation with Lina.', short: 'there was no written investigation', words: ['investigat', 'inquiry', 'enquiry'] },
              { label: 'No dismissal decision was put in writing.', short: 'the decision was not put in writing', words: ['in writing', 'written', 'writing', 'letter'] },
              { label: 'Lina was not given notice or told formally that she was dismissed.', short: 'Lina was not given notice', words: ['notice', 'notif', 'inform', 'told her', 'tell her'] },
              { label: 'The decision must be justified and handed to the worker.', short: 'the decision must be justified and handed over', words: ['justif', 'hand it', 'handed', 'hand over', 'reason'] },
              { label: 'The law sets a process that must be followed. A handbook rule cannot skip it.', short: 'the law sets a process the handbook cannot skip', words: ['process', 'procedure', 'article 44', 'evidence', 'formal', 'law says', 'the law', 'legal', 'override'] }
            ],
            feedback: {
              good: 'Good, you have linked your answer to the law.',
              more: 'A strong answer would also mention:',
              none: 'Your answer does not link to the law yet. Look again at Article 44 above. What must the employer do before dismissing someone? Think about the investigation, and how the decision is given to the worker.',
              empty: 'Type your answer first, then select Check my answer.'
            }
          }
        },
        {
          id: 'assessment',
          type: 'assessment',
          title: 'Assessment',
          intro: 'Answer all three questions, then select Submit. You need all three correct to continue. If any are wrong, read the feedback and try the same questions again.',
          pick: 3,
          /* In a hint, {{words|page-id}} or {{words|page-id:section}} becomes an underlined link back to that page
             (section = the tab or panel to open, counting from 0).
             Question bank: 3 are picked at random for each learner and kept
             the same on every retry. type: 'recall' or 'apply' (critical thinking). */
          bank: [
            { id: 'q1', type: 'recall', q: 'What is the maximum probation period under the UAE Labour Law?',
              options: ['Three months', 'Six months, and it cannot be extended', 'Six months, which management can extend if needed'], correct: 1,
              hint: 'Look back at the first {{“Who would win?” question|who-wins-1}} and what the law itself said about the length of probation.',
              explain: 'The law sets a maximum of six months, and a company cannot extend it beyond that.' },
            { id: 'q2', type: 'recall', q: 'How long must employee records be kept after an employee leaves?',
              options: ['At least 6 months', 'At least 1 year', 'At least 2 years'], correct: 2,
              hint: 'Record keeping is an employer obligation under Article 13. Think about what the {{Record Keeping section|record-keeping}} said about how long files are kept after someone leaves.',
              explain: 'Records need to be kept for at least 2 years after the employee has left.' },
            { id: 'q3', type: 'recall', q: 'If the English and Arabic versions of the Labour Law differ in meaning, which one applies?',
              options: ['The English version', 'The Arabic version', 'Whichever version the employer chooses'], correct: 1,
              hint: 'Revisit the {{Translation panel|understanding-the-law:0}} in “The Law: Understanding the Document”. In which language was the law originally written?',
              explain: 'The Arabic text is the authoritative version and prevails if there is any difference.' },
            { id: 'q4', type: 'recall', q: 'In the four-layered framework, which layer acts as “the enforcer”?',
              options: ['The Executive Regulations', 'The Regulatory Authorities, such as MOHRE', 'Internal company policies'], correct: 1,
              hint: 'Think about the {{pyramid|four-layers}}: one layer is the foundation, one is the how, one is the day to day. Which layer issues permits and deals with disputes?',
              explain: 'Regulatory authorities such as MOHRE oversee and enforce: they issue work permits, approve contracts and deal with disputes.' },
            { id: 'q5', type: 'recall', q: 'What is the main purpose of the Wage Protection System (WPS)?',
              options: ['To process and monitor employee wage payments', 'To support Emiratisation in the private sector', 'To provide insurance when employment is lost involuntarily'], correct: 0,
              hint: 'Each {{compliance system|enforcer}} has its own job. The clue is in the name: what does WPS protect?',
              explain: 'WPS is the electronic system used to process and monitor wage payments so employees are paid the correct amount on time.' },
            { id: 'q6', type: 'recall', q: 'Which group is covered by Federal Decree-Law No. 33 of 2021?',
              options: ['Domestic workers', 'Employees working in the UAE private sector', 'Police and security personnel'], correct: 1,
              hint: 'Revisit {{“Who is the law for?”|understanding-the-law:3}}. Article 3 lists groups that are covered by their own legislation instead.',
              explain: 'The law covers employees working in the UAE private sector. Domestic workers, police and security personnel, armed forces and government employees are excluded.' },
            { id: 'q7', type: 'apply', q: 'A new hire’s digital visa shows the employer as “Gulf Coast Trading LLC”. What does this tell HR about the likely jurisdiction?',
              options: ['It is most likely a Mainland company', 'It is most likely a Free Zone company', 'It is most likely a DIFC company'], correct: 0,
              hint: 'Use the {{three-step jurisdiction check|jurisdiction-steps}}. Step 2 is about what the company name ends with.',
              explain: 'A name ending in LLC points to the Mainland jurisdiction; FZE or FZ-LLC would point to a Free Zone.' },
            { id: 'q8', type: 'apply', q: 'An advisory firm based in a Dubai financial free zone and regulated by the DFSA asks you to apply the Federal Labour Law to an employee dispute. What should you do first?',
              options: ['Apply the Federal Labour Law, as it covers all private-sector employees', 'Recognise the company is likely in the DIFC, which has its own employment law and courts', 'Apply the company handbook, because free zones have no employment law'], correct: 1,
              hint: 'Think about {{step 3 of the jurisdiction check|jurisdiction-steps}}, and what {{Sarah said about the financial free zones|decision-tree}} and English common law.',
              explain: 'A Dubai financial free zone firm regulated by the DFSA is in the DIFC, which has its own employment-law regime, courts and end-of-service scheme.' },
            { id: 'q9', type: 'apply', q: 'Your company handbook gives 90 days of fully paid maternity leave. An employee asks whether the law’s 60 days applies instead. Which applies?',
              options: ['The law’s 60 days, because the law always overrides company rules', 'The handbook’s 90 days, because it is more favourable to the employee', 'Whichever the employee’s manager approves'], correct: 1,
              hint: 'Remember {{“the law is the floor, not the ceiling”|remember}}. Ask which rule gives the employee more.',
              explain: 'A company can give more favourable terms than the legal minimum, so the more generous handbook rule applies.' },
            { id: 'q10', type: 'apply', q: 'A manager wants to end a probationary employee’s employment today with no notice, as the handbook allows. What is your best advice?',
              options: ['Go ahead, because the employee signed the handbook', 'Give written notice at least 14 days before the termination date', 'Tell the employee verbally today and end the employment tomorrow'], correct: 1,
              hint: 'Look again at the {{Example page|example}} and the underlined parts of Article 9: how must notice be given, and how far in advance?',
              explain: 'Article 9 requires written notice at least 14 days before termination during probation. A handbook cannot override this.' },
            { id: 'q11', type: 'apply', q: 'An employee’s fixed-term contract ended last month, but they are still working and being paid. No renewal was signed. What is the position?',
              options: ['The employment ended at expiry, so they are working without a contract', 'The contract is treated as implicitly extended on the same conditions', 'The contract has automatically become an unlimited contract'], correct: 1,
              hint: 'Revisit the {{“Renewal, Continuity & Expiry” tab|contracts:2}}. What happens when both sides simply carry on?',
              explain: 'If both parties carry on after expiry, the contract is treated as implicitly extended on the same conditions. Unlimited contracts no longer exist.' },
            { id: 'q12', type: 'apply', q: 'An employee’s contract is renewed for a shorter term. They ask whether their gratuity and leave balance start again from zero. What do you tell them?',
              options: ['Both reset to zero on renewal', 'Both continue; they do not reset', 'Gratuity is paid out and leave is reset'], correct: 1,
              hint: 'Think about what the {{Contracts tabs|contracts}} said continues through a renewal, and whether the length of the new term matters.',
              explain: 'On renewal, gratuity and accumulated statutory leave continue and do not reset, whatever the new term.' },
            { id: 'q13', type: 'apply', q: 'A colleague calculates an entitlement that the law bases on “basic wage” and includes the housing allowance. What is the problem?',
              options: ['There is no problem; basic wage and wage mean the same thing', 'Basic wage is salary only, so including allowances gives the wrong figure', 'Allowances must be included in every calculation under the law'], correct: 1,
              hint: '{{Article 1 definitions|understanding-the-law:2}} matter. Compare how the law defines “basic wage” with how it defines “wage”.',
              explain: 'Basic wage = salary only; wage = salary + allowances. Same topic, different word, different calculation.' },
            { id: 'q14', type: 'apply', q: 'A manager says an employee verbally agreed to take unpaid leave. Nothing was written down, and the employee now disputes it. Where does this leave the company?',
              options: ['In a strong position, because a verbal agreement is binding', 'In a weak position, because without documented proof the agreement carries no weight', 'It is up to the employee to prove they did not agree'], correct: 1,
              hint: 'In a dispute, who usually has to show proof of compliance? Think about the one thing to remember from {{Record Keeping|record-keeping}}.',
              explain: 'It is almost always up to the employer to prove compliance, and verbal agreements have no weight. If it isn’t documented and acknowledged, it doesn’t exist.' },
            { id: 'q15', type: 'apply', q: 'An employee has been absent without notice for 7 days. The signed handbook says 5 days means automatic termination, so HR stops salary and removes them from payroll. What is the biggest risk?',
              options: ['There is no risk, because the employee signed the handbook', 'With no investigation or written dismissal, the company cannot prove when employment ended', 'The only risk is a late payment flag on the WPS'], correct: 1,
              hint: 'Think about {{Lina’s case and what Article 44 says|case-summary}} must happen before a dismissal.',
              explain: 'Without a written investigation and a written, justified dismissal, there is no formal termination date, so salary and entitlements may still be owed.' },
            { id: 'q16', type: 'apply', q: 'During your monthly compliance check you see payroll has not been processed and the salary due date was 16 days ago. Why does this need action now?',
              options: ['It is one of the risky items that can lead to costly fines', 'It only becomes a problem after 30 days', 'It only matters for Emirati employees'], correct: 0,
              hint: 'Recall the {{three risky items on the flip cards|risky-items}}. Which one mentions a number of days?',
              explain: 'Payroll not processed within 15 days of the salary due date is one of the three risky items to attend to immediately.' },
            { id: 'q17', type: 'apply', q: 'An employee’s contract runs for three years, but their work permit was issued for two years. What should HR do?',
              options: ['Nothing; the contract covers the full three years', 'Track both dates and renew the permit before it expires', 'Shorten the contract to two years to match the permit'], correct: 1,
              hint: 'Revisit the {{Work Permit tab|contracts:3}}. Are the contract and the permit the same thing?',
              explain: 'The contract is the employment agreement; the permit is government authorisation to work. Track both so neither expires unnoticed.' },
            { id: 'q18', type: 'apply', q: 'A company with 60 employees has not increased Emirati representation in skilled roles this year. What is the most likely consequence?',
              options: ['None, because Emiratisation is voluntary', 'Financial contributions for each required Emirati position left unfilled', 'Automatic cancellation of the trade licence'], correct: 1,
              hint: 'Revisit the {{Emiratisation hotspots|emiratisation}}. What applies to companies with 50+ employees, and what does non-compliance cost?',
              explain: 'Companies with 50+ employees have yearly targets; unmet targets can lead to financial contributions for each unfilled required position, and MOHRE checks compliance.' },
            { id: 'q19', type: 'apply', q: 'A draft policy says only male employees may apply for supervisor roles. How should HR respond?',
              options: ['Approve it; company policies govern day-to-day practice', 'Reject it; the law protects employees against discrimination based on sex', 'Approve it as long as every employee signs the handbook'], correct: 1,
              hint: 'Look again at the {{Equality and Non-discrimination panel|understanding-the-law:4}}, and remember an internal policy cannot remove a right provided by law.',
              explain: 'The law protects against discrimination based on sex, and internal policies must comply with the law.' },
            { id: 'q20', type: 'apply', q: 'A recruitment policy prioritises qualified UAE nationals to help meet Emiratisation targets. Is this discriminatory under the Labour Law?',
              options: ['Yes, it is discrimination based on national origin', 'No, rules that support Emiratisation are not considered discriminatory', 'Only if the company has fewer than 50 employees'], correct: 1,
              hint: 'The {{Equality and Non-discrimination panel|understanding-the-law:4}} has an important exception written in the second shield.',
              explain: 'Rules that support Emiratisation are not considered discriminatory under the law.' },
            { id: 'q21', type: 'apply', q: 'You need to check the rules on annual leave in the Labour Law quickly. What is the best approach?',
              options: ['Read articles 1–74 from the beginning', 'Identify where the employee is in the employment journey and go to that section', 'Check the company handbook first, because it overrides the law'], correct: 1,
              hint: 'Revisit the {{Navigation panel|understanding-the-law:1}}. How is the law organised, and what did Sarah suggest you identify first?',
              explain: 'The law follows the employment journey, so go straight to the leave section (articles 27–41).' }
          ]
        },
        {
          id: 'checklist',
          type: 'checklist',
          title: 'Learning Checklist',
          image: 'assets/images/checklist-bg.jpg',
          items: [
            'There are 4 parts to the labour law framework: the federal law, the executive regulations, regulatory authorities, and internal governance.',
            'Different jurisdictions have different rules. Make sure you know your company’s jurisdiction and how to find your employees’ jurisdiction.',
            'The law is organised to reflect an employee lifecycle.',
            'The law is the floor but not the ceiling. Company rules must align with the law or give the employee more favourable terms.',
            'Keep accurate records as proof of procedure. Verbal agreements hold no weight with MOHRE or the courts.'
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      title: 'Path B: HR in Practice',
      path: 'B',
      pages: [
        {
          id: 'path-b',
          type: 'comingSoon',
          title: 'Path B',
          heading: 'Path B is being built',
          text: 'In Path B you will learn about the Labour Law by taking the role of an HR employee, solving day-to-day workplace problems. This path is coming soon.'
        }
      ]
    }
  ]
};
