import { sample as aiSample, tts as aiTts, aiReady } from './claude.js';

// Script de tanit-citoyen.html, inchangé sauf : cet import, schema:... sur les 2 appels JSON, et le démarrage en bas.
const L = {
fr:{
 tagline:"Mon compte citoyen", proto:"Prototype étudiant, hackathon Sciences Po. Non affilié à l'État. Rien n'est envoyé.",
 n_home:"Accueil", n_cap:"Capital", n_vote:"Je vote", n_aid:"Mes aides", n_ask:"Question",
 tag_sim:"Simulation", tag_ex:"Exemple", listen:"Écouter", explain:"M'expliquer simplement", back:"Retour à l'accueil",
 home_h1:"Vos prélèvements deviennent votre capital.",
 home_cap:"Votre capital Tanit à 64 ans", home_cap_p:"Une petite part de ce que vous payez déjà devient une épargne à votre nom.", home_cap_btn:"Voir mon capital",
 home_3:"Tanit en trois points",
 b1:"Ce que vous payez devient une épargne qui vous appartient.", b2:"L'État a moins besoin d'emprunter pour investir.", b3:"Les entreprises françaises et européennes reçoivent un capital stable, sur le long terme.",
 g_q1:"Est-ce un impôt en plus ?", g_a1:"Non. La contribution (1 % à 4 % du revenu) est prise sur des prélèvements qui existent déjà, comme une part de la CSG. Elle passe par le prélèvement à la source.",
 g_q2:"Qui gère mon argent ?", g_a2:"Des gestionnaires professionnels et indépendants, publics ou privés. Un conseil de surveillance indépendant les contrôle. L'État reste minoritaire et ne dirige pas les investissements.",
 g_q3:"Mon capital est-il garanti ?", g_a3:"Non. L'État ne garantit ni le capital ni le rendement. En échange, les parts vous appartiennent et ne peuvent pas servir à combler le déficit de l'État.",
 g_q4:"Comment suivre mon argent ?", g_a4:"Vous recevez un relevé tous les trois mois : ce que vous avez versé, où c'est investi et ce que cela rapporte.",
 home_vote:"Vous décidez des grandes orientations", home_vote_p:"Climat ou industrie, secteurs prioritaires, niveau de risque : les citoyens votent.", home_vote_btn:"Voter",
 home_aid:"Aides que vous pourriez toucher", home_aid_p:"Par mois. Estimation à confirmer auprès de la CAF et de l'Assurance maladie.", home_aid_btn:"Voir mes aides", home_etat:"Espace décideurs publics",
 ex_camille:"Exemple : Camille, 34 ans", ex_you:"Votre estimation",
 cap_h1:"Mon capital Tanit", cap_rev:"Mon revenu net par mois :", cap_age:"Mon âge :", years:"ans",
 cap_at64:"À 64 ans, vous auriez", cap_with:"Avec Tanit", cap_livret:"Même somme sur un livret",
 cap_detail:(t,m,n,tot)=>`Contribution : ${t} % de votre revenu, soit ${m} par mois pendant ${n} ans. Total versé : ${tot}.`,
 cap_where:"Où votre argent est investi", cap_eu:"Une partie est investie dans des projets européens communs : batteries, hydrogène, défense, infrastructures.",
 comp:["Infrastructures (réseaux, énergie, transports)","Entreprises stratégiques","Innovation et PME","Solidarité"],
 rel_h:"Mon relevé du trimestre", rel_p:"Voici ce que vous recevriez tous les trois mois.", rel_in:"Versé ce trimestre", rel_btn:"Résumer mon relevé",
 cap_hyp:"Hypothèses de l'équipe, à valider : contribution de 1 % à 4 % selon le revenu, revenu constant, rendements annuels de 4,5 % (infrastructures), 5 % (entreprises), 7 % (innovation), 0 % (solidarité), livret à 1,7 %. Aucune garantie de l'État.",
 vote_h1:"Je vote", vote_intro:"Les citoyens fixent les grandes orientations. Les gestionnaires choisissent ensuite les investissements.",
 v1_q:"1. Quelle priorité pour les nouveaux investissements ?", v1_a:"Transition écologique", v1_b:"Industrie souveraine",
 v2_q:"2. Quel secteur renforcer en premier ?", v2:["Énergie","Transports","Technologies critiques","Batteries et hydrogène","Défense"],
 v3_q:"3. Quel niveau de risque pour le fonds ?", v3:["Prudent : moins de gains, moins de pertes possibles","Équilibré","Dynamique : plus de gains possibles, plus de pertes possibles"],
 vote_explain:"Comprendre les enjeux avant de voter", vote_go:"Je vote", vote_ok:"Vote enregistré", vote_done:"Il reste sur cet appareil : le prototype ne compte pas encore les votes.",
 aid_h1:"Mes aides", aid_s1:"1. Ma situation", aid_photo:"Prendre mon document en photo", aid_photo_p:"L'assistant remplit les cases à votre place. Vous pouvez aussi les remplir vous-même.",
 f_rev:"Revenu net par mois (€)", f_loyer:"Loyer par mois (€)", f_age:"Âge", f_enf:"Enfants à charge", f_vie:"Je vis", f_act:"Mon activité",
 o_seul:"seul ou seule", o_couple:"en couple", o_sal:"salarié", o_ind:"indépendant", o_chom:"sans emploi", o_etu:"étudiant", o_ret:"retraité",
 aid_find:"Chercher mes aides", aid_s2:"2. Ce que l'assistant a trouvé", tag_ai:"Estimation par l'IA",
 elig:{probable:"Probable",possible:"À vérifier","peu probable":"Peu probable"}, about:"environ", permonth:"par mois", health:"Frais de santé réduits", org:"Organisme :", prep:"Préparer mon dossier",
 dos_title:"Mon dossier :", dos_pieces:"Pièces à réunir :", dos_ok:"Je relis et je valide", dos_tag:"Validé", dos_done:"Dans ce prototype, rien n'est envoyé. Dans la version finale, le dossier partirait à l'organisme après votre accord.",
 ask_h1:"Poser une question", ask_label:"Votre question", ask_send:"Envoyer", ask_stop:"Arrêter", ask_ph:"Par exemple : mon capital est-il garanti ?",
 chips:["C'est quoi Tanit, en deux phrases ?","Que se passe-t-il si le fonds perd de l'argent ?","Ai-je droit à la prime d'activité ?"],
 et_h1:"Espace décideurs publics", et_intro:"Tester le projet Tanit à l'échelle du pays.",
 et_coll:"Collecte par an :", bn:"Md€", et_stock:"Capital accumulé", et_in:n=>`Dans ${n} ans`, et_stock_p:"Collecte constante, rendement moyen de 4,5 % par an. Une collecte de 20 Md€ représente un peu moins d'un point de PIB.",
 et_euro:"Tanit reste-t-il hors de la dette publique ?", et_euro_p:"Les conditions du mémo. Décochez-en une pour voir le risque.",
 k1:"Aucune garantie de l'État sur le capital ou le rendement", k2:"Les actifs appartiennent aux citoyens, porteurs de parts", k3:"Bilan séparé du budget de l'État, protégé par une loi organique", k4:"Gouvernance indépendante, État minoritaire",
 e_ok:"Conditions du mémo réunies", e_ko:"Risque de requalification en dette publique", et_btn:"Lancer le test par l'agent", et_warn:"L'agent prépare l'analyse. Seuls l'INSEE et Eurostat décident du classement.",
 wait:"L'assistant rédige…", think:"Je réfléchis…", reading:"L'assistant lit votre document…", searching:"L'assistant cherche vos aides. Cela peut prendre une minute…",
 no_ai:"L'assistant n'est pas disponible dans cette vue. Les résultats affichés sont des exemples.",
 unread:"Je n'arrive pas à lire ce document. Reprenez la photo bien à plat, ou remplissez les cases.", read_ok:"Document lu. Vérifiez les cases, puis cherchez vos aides.",
 found:"Voici une estimation. Seul l'organisme peut confirmer vos droits.", none:"Aucune aide trouvée pour cette situation.",
 err:{not_granted:"Vous n'avez pas autorisé l'assistant. Vous pouvez continuer sans lui.",rate_limited:"Trop de demandes d'un coup. Réessayez dans une minute.",images_unavailable:"La lecture de photo n'est pas disponible ici. Remplissez les cases vous-même.",cancelled:"Arrêté.",other:"L'assistant n'a pas pu répondre. Réessayez."},

 skip:"Passer", next:"Suivant", start:"Commencer", or:"ou", cancel:"Annuler", back_simple:"Retour", read_policy:"Lire la politique de confidentialité",
 intro:[["Vos prélèvements deviennent votre capital","Une petite part de ce que vous payez déjà devient une épargne à votre nom, investie dans l'économie française et européenne."],["Les aides que vous pourriez toucher","L'assistant lit vos documents, repère les aides que vous ne touchez pas et prépare le dossier. C'est vous qui validez."],["Vous gardez la main","Vous votez sur les grandes orientations. Vous choisissez ce que l'appli peut utiliser, et vous pouvez tout effacer à tout moment."]],
 lg_h1:"Connectez-vous", lg_p:"Pour retrouver votre capital, vos votes et vos démarches.",
 lg_fc:"Continuer avec FranceConnect", lg_fc_sub:"Simulation : aucune vraie connexion", lg_mail:"Votre adresse e-mail", lg_send:"Recevoir un code",
 lg_code:"Code à 6 chiffres", lg_code_hint:"Démonstration : tapez 123456. Aucun e-mail n'est envoyé.", lg_ok:"Valider", lg_demo:"Essayer sans compte",
 lg_bad_mail:"Cette adresse ne semble pas valide.", lg_bad_code:"Code incorrect. Pour la démo, tapez 123456.", lg_fc_wait:"Connexion en cours…",
 lg_note:"Dans la version finale, la connexion passe par FranceConnect, le service d'identité de l'État. L'appli ne voit jamais votre mot de passe.",
 m_fc:"FranceConnect (simulé)", m_mail:"E-mail", m_demo:"Mode démo", demo_name:"Camille Martin", guest:"Invité",
 cs_h1:"Vos données, vos choix", cs_p:"Choisissez ce que l'appli peut utiliser. Vous pourrez changer d'avis à tout moment dans votre compte.",
 cs:[["base","Fonctionnement de l'appli","Votre compte et la sécurité. Toujours actif."],["doc","Lecture de vos documents par l'IA","La photo est lue puis supprimée. Seuls les montants utiles sont gardés."],["ai","Assistant et estimations par l'IA","Votre situation est envoyée au modèle d'IA pour vous répondre. Elle ne sert pas à l'entraîner."],["stats","Statistiques anonymes","Nous comptons les écrans visités, sans savoir qui vous êtes."]],
 cs_all:"Tout accepter", cs_save:"Valider mes choix",
 ai_off:"Vous avez désactivé l'IA. Vous pouvez la réactiver dans votre compte, rubrique Confidentialité.", doc_off:"Vous avez désactivé la lecture de documents. Remplissez les cases vous-même, ou réactivez-la dans votre compte.",
 ac_dos:"Mes démarches", ac_dos_empty:"Aucune démarche pour l'instant. Préparez un dossier depuis « Mes aides ».",
 steps:["Dossier préparé","Validé par vous","Transmis à l'organisme","En cours d'examen","Décision"], ac_sent_note:"Transmission simulée dans ce prototype.",
 ac_priv:"Confidentialité", ac_data:"Ce que l'appli garde sur cet appareil", ac_wipe:"Effacer toutes mes données", ac_wipe_q:"Tout sera effacé : compte, choix, votes et démarches. Cette action est définitive.", ac_wipe_yes:"Oui, tout effacer",
 ac_pref:"Préférences", ac_lang:"Langue", ac_size:"Taille du texte", ac_theme:"Apparence", th_auto:"Auto", th_light:"Clair", th_dark:"Sombre",
 ac_help:"Aide et informations légales",
 lh_q1:"Mentions légales", lh_a1:"Prototype réalisé par une équipe d'étudiants pour le Sciences Po AI Hackathon 2026. Il n'est ni édité ni approuvé par l'État ou par un organisme public.",
 lh_q2:"Conditions d'utilisation", lh_a2:"Les montants affichés sont des simulations et des estimations. Ils ne créent aucun droit. Seuls les organismes (CAF, Assurance maladie, impôts) confirment vos droits.",
 lh_q3:"Accessibilité", lh_a3:"Objectif : conformité au référentiel RGAA. Gros boutons, contrastes renforcés, taille du texte réglable, lecture à voix haute et navigation au clavier.",
 lh_q4:"Nous contacter", lh_a4:"Par e-mail à l'équipe du projet, ou auprès d'un mentor pendant le hackathon.",
 logout:"Se déconnecter", since:"Connecté via",
 po_h1:"Politique de confidentialité", po_intro:"Ce que nous ferions de vos données dans la version finale. Ce prototype n'envoie rien à aucun organisme.",
 po:[["Qui est responsable ?","Dans la version finale : l'établissement public qui gère Tanit. Un délégué à la protection des données (DPO) répond à vos questions."],
     ["Quelles données ?","Identité (via FranceConnect), revenus et situation familiale, documents que vous photographiez, vos votes, vos démarches."],
     ["Pour quoi faire ?","Calculer votre capital Tanit, estimer vos aides, préparer vos dossiers, enregistrer vos votes. Jamais de publicité, jamais de revente."],
     ["Sur quelle base légale ?","Votre consentement pour la lecture de documents, l'IA et les statistiques. La mission d'intérêt public pour le compte Tanit."],
     ["Combien de temps ?","Photos : supprimées juste après la lecture. Dossiers : le temps de la démarche, puis archivés selon les règles de l'organisme. Compte : jusqu'à sa suppression."],
     ["Qui les reçoit ?","L'organisme concerné (CAF, Assurance maladie…), seulement après votre validation. Le prestataire d'IA, sous contrat, sans droit de réutilisation."],
     ["Comment sont-elles protégées ?","Chiffrement pendant le transfert et le stockage, hébergement en France sur un cloud qualifié, accès tracés, tests de sécurité réguliers."],
     ["Et l'IA décide-t-elle pour moi ?","Non. L'IA estime et prépare. Vous validez, et l'organisme décide. Aucune décision n'est prise automatiquement."],
     ["Vos droits","Accès, rectification, effacement, portabilité, opposition et retrait du consentement, depuis votre compte. Vous pouvez aussi saisir la CNIL."]],
 kept:{lang:"Langue choisie",session:"Compte",consent:"Vos choix de confidentialité",v1:"Vote 1",v2:"Vote 2",v3:"Vote 3",dossiers:"Démarches",big:"Taille du texte",theme:"Apparence",onb:"Présentation vue"}, nothing:"Rien pour l'instant.",
 ai_lang:"Réponds en français.", bigOn:"A−", bigOff:"A+", langSwitch:"English"
},
en:{
 tagline:"My citizen account", proto:"Student prototype, Sciences Po hackathon. Not affiliated with the French State. Nothing is sent.",
 n_home:"Home", n_cap:"Capital", n_vote:"Vote", n_aid:"Benefits", n_ask:"Ask",
 tag_sim:"Simulation", tag_ex:"Example", listen:"Listen", explain:"Explain it simply", back:"Back to home",
 home_h1:"What you already pay becomes your capital.",
 home_cap:"Your Tanit capital at 64", home_cap_p:"A small share of what you already pay becomes savings in your name.", home_cap_btn:"See my capital",
 home_3:"Tanit in three points",
 b1:"What you pay becomes savings that belong to you.", b2:"The State needs to borrow less to invest.", b3:"French and European companies get stable, long-term capital.",
 g_q1:"Is it an extra tax?", g_a1:"No. The contribution (1% to 4% of income) comes out of levies that already exist, such as part of the CSG social levy. It is collected at source, like income tax.",
 g_q2:"Who manages my money?", g_a2:"Independent professional managers, public or private. An independent supervisory board oversees them. The State holds a minority role and does not run the investments.",
 g_q3:"Is my capital guaranteed?", g_a3:"No. The State guarantees neither the capital nor the return. In exchange, the units belong to you and cannot be used to cover the State's deficit.",
 g_q4:"How do I follow my money?", g_a4:"You get a statement every three months: what you paid in, where it is invested and what it earns.",
 home_vote:"You decide the main direction", home_vote_p:"Climate or industry, priority sectors, level of risk: citizens vote.", home_vote_btn:"Vote",
 home_aid:"Benefits you could receive", home_aid_p:"Per month. An estimate, to be confirmed by the benefits office (CAF) and the health insurance fund.", home_aid_btn:"See my benefits", home_etat:"Policymakers' area",
 ex_camille:"Example: Camille, 34", ex_you:"Your estimate",
 cap_h1:"My Tanit capital", cap_rev:"My net income per month:", cap_age:"My age:", years:"years",
 cap_at64:"At 64, you would have", cap_with:"With Tanit", cap_livret:"Same amount in a savings account",
 cap_detail:(t,m,n,tot)=>`Contribution: ${t}% of your income, or ${m} a month for ${n} years. Total paid in: ${tot}.`,
 cap_where:"Where your money is invested", cap_eu:"Part of it goes to shared European projects: batteries, hydrogen, defence, infrastructure.",
 comp:["Infrastructure (networks, energy, transport)","Strategic companies","Innovation and small businesses","Solidarity"],
 rel_h:"My quarterly statement", rel_p:"This is what you would receive every three months.", rel_in:"Paid in this quarter", rel_btn:"Summarise my statement",
 cap_hyp:"Team assumptions, to be validated: contribution of 1% to 4% depending on income, constant income, yearly returns of 4.5% (infrastructure), 5% (companies), 7% (innovation), 0% (solidarity), savings account at 1.7%. No State guarantee.",
 vote_h1:"My vote", vote_intro:"Citizens set the main direction. Managers then choose the investments.",
 v1_q:"1. What should new investments prioritise?", v1_a:"Green transition", v1_b:"Sovereign industry",
 v2_q:"2. Which sector should come first?", v2:["Energy","Transport","Critical technologies","Batteries and hydrogen","Defence"],
 v3_q:"3. How much risk should the fund take?", v3:["Cautious: lower gains, lower possible losses","Balanced","Dynamic: higher possible gains, higher possible losses"],
 vote_explain:"Understand the stakes before voting", vote_go:"Cast my vote", vote_ok:"Vote saved", vote_done:"It stays on this device: the prototype does not count votes yet.",
 aid_h1:"My benefits", aid_s1:"1. My situation", aid_photo:"Take a photo of my document", aid_photo_p:"The assistant fills in the boxes for you. You can also fill them in yourself.",
 f_rev:"Net income per month (€)", f_loyer:"Rent per month (€)", f_age:"Age", f_enf:"Dependent children", f_vie:"I live", f_act:"My work",
 o_seul:"alone", o_couple:"with a partner", o_sal:"employee", o_ind:"self-employed", o_chom:"unemployed", o_etu:"student", o_ret:"retired",
 aid_find:"Find my benefits", aid_s2:"2. What the assistant found", tag_ai:"AI estimate",
 elig:{probable:"Likely",possible:"To check","peu probable":"Unlikely"}, about:"about", permonth:"a month", health:"Lower health costs", org:"Office:", prep:"Prepare my application",
 dos_title:"My application:", dos_pieces:"Documents to gather:", dos_ok:"I have checked it and I approve", dos_tag:"Approved", dos_done:"In this prototype, nothing is sent. In the final version, the application would go to the office after your approval.",
 ask_h1:"Ask a question", ask_label:"Your question", ask_send:"Send", ask_stop:"Stop", ask_ph:"For example: is my capital guaranteed?",
 chips:["What is Tanit, in two sentences?","What happens if the fund loses money?","Can I get the in-work benefit (prime d'activité)?"],
 et_h1:"Policymakers' area", et_intro:"Test the Tanit project at country scale.",
 et_coll:"Collected per year:", bn:"bn €", et_stock:"Capital built up", et_in:n=>`In ${n} years`, et_stock_p:"Constant collection, average return of 4.5% a year. €20bn collected is a little under one point of GDP.",
 et_euro:"Does Tanit stay outside public debt?", et_euro_p:"The conditions set in the memo. Untick one to see the risk.",
 k1:"No State guarantee on capital or return", k2:"Assets belong to citizens, as unit holders", k3:"Balance sheet separate from the State budget, protected by an organic law", k4:"Independent governance, State in the minority",
 e_ok:"Memo conditions met", e_ko:"Risk of reclassification as public debt", et_btn:"Run the agent's test", et_warn:"The agent prepares the analysis. Only INSEE and Eurostat decide the classification.",
 wait:"The assistant is writing…", think:"Thinking…", reading:"The assistant is reading your document…", searching:"The assistant is looking for your benefits. This can take a minute…",
 no_ai:"The assistant is not available in this view. The results shown are examples.",
 unread:"I cannot read this document. Retake the photo with the page flat, or fill in the boxes.", read_ok:"Document read. Check the boxes, then find your benefits.",
 found:"This is an estimate. Only the office can confirm your rights.", none:"No benefit found for this situation.",
 err:{not_granted:"You did not allow the assistant. You can continue without it.",rate_limited:"Too many requests at once. Try again in a minute.",images_unavailable:"Photo reading is not available here. Fill in the boxes yourself.",cancelled:"Stopped.",other:"The assistant could not answer. Try again."},

 skip:"Skip", next:"Next", start:"Get started", or:"or", cancel:"Cancel", back_simple:"Back", read_policy:"Read the privacy policy",
 intro:[["What you pay becomes your capital","A small share of what you already pay becomes savings in your name, invested in the French and European economy."],["Benefits you could receive","The assistant reads your documents, finds the benefits you are missing and prepares the application. You approve it."],["You stay in control","You vote on the main direction. You choose what the app may use, and you can erase everything at any time."]],
 lg_h1:"Sign in", lg_p:"To find your capital, your votes and your applications.",
 lg_fc:"Continue with FranceConnect", lg_fc_sub:"Simulation: no real sign-in", lg_mail:"Your email address", lg_send:"Get a code",
 lg_code:"6-digit code", lg_code_hint:"Demo: type 123456. No email is sent.", lg_ok:"Confirm", lg_demo:"Try without an account",
 lg_bad_mail:"This address does not look valid.", lg_bad_code:"Wrong code. For the demo, type 123456.", lg_fc_wait:"Signing in…",
 lg_note:"In the final version, sign-in goes through FranceConnect, the French State's identity service. The app never sees your password.",
 m_fc:"FranceConnect (simulated)", m_mail:"Email", m_demo:"Demo mode", demo_name:"Camille Martin", guest:"Guest",
 cs_h1:"Your data, your choice", cs_p:"Choose what the app may use. You can change your mind at any time in your account.",
 cs:[["base","Running the app","Your account and security. Always on."],["doc","AI reading of your documents","The photo is read, then deleted. Only the useful amounts are kept."],["ai","AI assistant and estimates","Your situation is sent to the AI model to answer you. It is not used to train it."],["stats","Anonymous statistics","We count the screens visited, without knowing who you are."]],
 cs_all:"Accept all", cs_save:"Save my choices",
 ai_off:"You turned the AI off. You can turn it back on in your account, under Privacy.", doc_off:"You turned document reading off. Fill in the boxes yourself, or turn it back on in your account.",
 ac_dos:"My applications", ac_dos_empty:"No applications yet. Prepare one from \"Benefits\".",
 steps:["Application prepared","Approved by you","Sent to the office","Under review","Decision"], ac_sent_note:"Sending is simulated in this prototype.",
 ac_priv:"Privacy", ac_data:"What the app keeps on this device", ac_wipe:"Erase all my data", ac_wipe_q:"Everything will be erased: account, choices, votes and applications. This cannot be undone.", ac_wipe_yes:"Yes, erase everything",
 ac_pref:"Preferences", ac_lang:"Language", ac_size:"Text size", ac_theme:"Appearance", th_auto:"Auto", th_light:"Light", th_dark:"Dark",
 ac_help:"Help and legal information",
 lh_q1:"Legal notice", lh_a1:"Prototype built by a team of students for the Sciences Po AI Hackathon 2026. It is not published or endorsed by the French State or any public body.",
 lh_q2:"Terms of use", lh_a2:"Amounts shown are simulations and estimates. They create no rights. Only the offices (CAF, health insurance, tax office) confirm your rights.",
 lh_q3:"Accessibility", lh_a3:"Goal: compliance with the French RGAA accessibility standard. Large buttons, strong contrast, adjustable text size, read-aloud and keyboard navigation.",
 lh_q4:"Contact us", lh_a4:"By email to the project team, or through a mentor during the hackathon.",
 logout:"Sign out", since:"Signed in with",
 po_h1:"Privacy policy", po_intro:"What we would do with your data in the final version. This prototype sends nothing to any office.",
 po:[["Who is responsible?","In the final version: the public body that runs Tanit. A data protection officer (DPO) answers your questions."],
     ["What data?","Identity (through FranceConnect), income and family situation, documents you photograph, your votes, your applications."],
     ["What for?","To calculate your Tanit capital, estimate your benefits, prepare your applications and record your votes. Never advertising, never resale."],
     ["On what legal basis?","Your consent for document reading, AI and statistics. Public-interest mission for the Tanit account."],
     ["For how long?","Photos: deleted right after reading. Applications: for the duration of the process, then archived under the office's rules. Account: until you delete it."],
     ["Who receives it?","The relevant office (CAF, health insurance…), only after you approve. The AI provider, under contract, with no right to reuse it."],
     ["How is it protected?","Encryption in transit and at rest, hosting in France on a certified cloud, logged access, regular security testing."],
     ["Does the AI decide for me?","No. The AI estimates and prepares. You approve, and the office decides. No decision is made automatically."],
     ["Your rights","Access, correction, erasure, portability, objection and withdrawal of consent, from your account. You can also complain to the CNIL, the French data protection authority."]],
 kept:{lang:"Chosen language",session:"Account",consent:"Your privacy choices",v1:"Vote 1",v2:"Vote 2",v3:"Vote 3",dossiers:"Applications",big:"Text size",theme:"Appearance",onb:"Introduction seen"}, nothing:"Nothing yet.",
 ai_lang:"Write your whole answer in English, and explain any French benefit name in a few words.", bigOn:"A−", bigOff:"A+", langSwitch:"Français"
}};
const EX = {
 fr:[{aide:"Prime d'activité",organisme:"CAF",eligibilite:"probable",montant_mensuel:160,pourquoi:"Vous travaillez et votre salaire est modeste.",pieces:["Bulletins de salaire des 3 derniers mois","RIB"]},
     {aide:"Aide au logement (APL)",organisme:"CAF",eligibilite:"possible",montant_mensuel:140,pourquoi:"Vous payez un loyer et avez un enfant à charge.",pieces:["Bail ou quittance de loyer","Avis d'imposition"]},
     {aide:"Complémentaire santé solidaire",organisme:"Assurance maladie",eligibilite:"possible",montant_mensuel:null,pourquoi:"Vos revenus sont proches du plafond. Elle réduit vos frais de santé.",pieces:["Avis d'imposition","Attestation de droits"]},
     {aide:"Chèque énergie",organisme:"État",eligibilite:"probable",montant_mensuel:12,pourquoi:"Attribué selon le revenu fiscal du foyer.",pieces:["Avis d'imposition"]}],
 en:[{aide:"In-work benefit (prime d'activité)",organisme:"CAF benefits office",eligibilite:"probable",montant_mensuel:160,pourquoi:"You work and your pay is modest.",pieces:["Payslips for the last 3 months","Bank details"]},
     {aide:"Housing benefit (APL)",organisme:"CAF benefits office",eligibilite:"possible",montant_mensuel:140,pourquoi:"You pay rent and have a dependent child.",pieces:["Lease or rent receipt","Tax notice"]},
     {aide:"Free top-up health cover (CSS)",organisme:"Health insurance fund",eligibilite:"possible",montant_mensuel:null,pourquoi:"Your income is close to the ceiling. It lowers your health costs.",pieces:["Tax notice","Proof of health cover"]},
     {aide:"Energy voucher (chèque énergie)",organisme:"State",eligibilite:"probable",montant_mensuel:12,pourquoi:"Granted according to household taxable income.",pieces:["Tax notice"]}]
};

const $ = id => document.getElementById(id);
const store = { get(k){try{return localStorage.getItem(k)}catch{return null}}, set(k,v){try{localStorage.setItem(k,v)}catch{}} };
let lang = store.get('lang') === 'en' ? 'en' : store.get('lang') === 'fr' ? 'fr' : null;
const t = k => (L[lang || 'fr'][k] ?? L.fr[k] ?? k);
const eur = n => new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Math.round(n));
let sample = null, tts = null;
const errCopy = c => t('err')[c] || t('err').other;
function say(btn, getText){ if (!tts) return; btn.hidden = false; btn.onclick = () => tts.speak(getText().slice(0,1900), {language: lang || 'fr'}).catch(()=>{}); }
function mk(tag, cls, text){ const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

/* ---------- langue et navigation ---------- */
const VIEWS = ['accueil','capital','vote','aides','assistant','etat','compte','politique'];
const GATES = ['lang','intro','login','consent'];
function applyLang(){
  document.documentElement.lang = lang || 'fr';
  document.querySelectorAll('[data-t]').forEach(e => { e.textContent = t(e.dataset.t); });
  $('q').placeholder = t('ask_ph'); $('langBtn').textContent = t('langSwitch');
  $('bigBtn').textContent = document.documentElement.classList.contains('big') ? t('bigOn') : t('bigOff');
  $('chips').replaceChildren(...t('chips').map(c => { const b = mk('button','ghost sm',c); b.onclick = () => ask(c); return b; }));
  buildOpts('v2', t('v2')); buildOpts('v3', t('v3'));
  if (!profilReel) aides = EX[lang || 'fr'];
  renderAides(); capital(); vote(); etat();
}
function route(){
  const h = location.hash.slice(1), g = gate();
  const v = (h === 'politique' && lang) ? 'politique' : g ? g : VIEWS.includes(h) ? h : 'accueil';
  [...GATES, ...VIEWS].forEach(n => { $('v-'+n).hidden = n !== v; });
  $('tools').hidden = !lang; $('nav').hidden = !!g || v === 'politique';
  $('acct').hidden = !session(); renderAccountBits();
  if (v === 'intro') renderIntro(); if (v === 'consent') renderConsent(); if (v === 'compte') renderAccount(); if (v === 'politique') renderPolicy();
  document.querySelectorAll('nav a').forEach(a => a.getAttribute('href') === '#'+v ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'));
  window.scrollTo(0,0);
  const h1 = document.querySelector('#v-' + v + ' h1');
  document.title = (h1 && h1.textContent ? h1.textContent.trim() + ' · ' : '') + 'Tanit Citoyen';
  if (routed && h1) { h1.setAttribute('tabindex', '-1'); h1.focus({preventScroll:true}); }
  routed = true;
}
let routed = false;
document.querySelectorAll('[data-lang]:not([data-v])').forEach(b => b.onclick = () => { lang = b.dataset.lang; store.set('lang', lang); applyLang(); route(); });
$('langBtn').onclick = () => { lang = lang === 'fr' ? 'en' : 'fr'; store.set('lang', lang); applyLang(); };
$('bigBtn').onclick = () => { const on = document.documentElement.classList.toggle('big'); $('bigBtn').setAttribute('aria-pressed', on); $('bigBtn').textContent = on ? t('bigOn') : t('bigOff'); store.set('big', on ? '1' : ''); };
addEventListener('hashchange', route);

/* ---------- CAPITAL ---------- */
const SHARES = [.35,.30,.20,.15], RETS = [.045,.05,.07,0];
const R_TANIT = SHARES.reduce((s,w,i) => s + w*RETS[i], 0), R_LIVRET = .017;
const taux = r => r < 1500 ? .01 : r < 2500 ? .02 : r < 4000 ? .03 : .04;
const fv = (c, r, n) => c * ((Math.pow(1+r, n) - 1) / r);
let cap = {};
function capital(){
  const rev = +$('cRev').value, age = +$('cAge').value, n = 64 - age, tx = taux(rev), c = rev*12*tx;
  const a = fv(c, R_TANIT, n), b = fv(c, R_LIVRET, n); cap = {rev, age, n, tx, c, a, b};
  $('cRevV').textContent = eur(rev); $('cAgeV').textContent = age + ' ' + t('years');
  $('cTotal').textContent = eur(a); $('homeCap').textContent = eur(a);
  $('cDetail').textContent = t('cap_detail')(tx*100, eur(c/12), n, eur(c*n));
  $('cT1').textContent = eur(a); $('cT2').textContent = eur(b);
  $('cB1').style.width = '100%'; $('cB2').style.width = Math.max(4, b/a*100) + '%';
  const comp = t('comp');
  $('allocImg').setAttribute('aria-label', comp.map((c,i) => c + ' ' + SHARES[i]*100 + ' %').join(', '));
  $('legend').replaceChildren(...comp.flatMap((name,i) => [mk('span','sw c'+(i+1)), mk('span','',name), mk('b','',SHARES[i]*100 + ' %')]));
  const q = c/4;
  $('relTable').replaceChildren(mk('span'), mk('b','',t('rel_in')), mk('b','',eur(q)), ...comp.flatMap((name,i) => [mk('span','sw c'+(i+1)), mk('span','',name), mk('b','',eur(q*SHARES[i]))]));
}
$('cRev').oninput = $('cAge').oninput = capital;
async function write(btn, out, prompt, sayBtn, tier){
  if (!aiOn()) { out.textContent = t('ai_off'); return; }
  if (!sample) { out.textContent = t('no_ai'); return; }
  btn.disabled = true; out.textContent = t('wait');
  try {
    const { text } = await sample(prompt + ' ' + t('ai_lang'), {modelTier: tier || 'quick', onText: ({text}) => { out.textContent = text; }});
    out.textContent = text; if (sayBtn) say(sayBtn, () => text);
  } catch (err) { out.textContent = (err && err.text) || errCopy(err && err.code); }
  btn.disabled = false;
}
const TANIT = "Tanit est une proposition (pas encore une réalité) de fonds national de capital public français : une contribution de 1 à 4 % du revenu, prise sur des prélèvements existants (pas un prélèvement en plus), devient des parts détenues par chaque citoyen, investies à long terme dans les infrastructures (35 %), les entreprises stratégiques (30 %), l'innovation et les PME (20 %) et la solidarité (15 %), avec une poche européenne. Gestion par des professionnels indépendants, État minoritaire, vote des citoyens sur les grandes orientations, relevé trimestriel, aucune garantie de l'État sur le capital ou le rendement. ";
$('cExplain').onclick = () => write($('cExplain'), $('cOut'),
  TANIT + "Explique à un citoyen de tout âge, en 90 mots maximum, avec des mots très simples, sans Markdown, cette simulation : revenu net " + cap.rev + " € par mois, " + cap.age + " ans, contribution de " + cap.tx*100 + " %, capital estimé à 64 ans " + Math.round(cap.a) + " € contre " + Math.round(cap.b) + " € sur un livret. Dis clairement que c'est une simulation et que le capital peut baisser.", $('cSay'));
$('relBtn').onclick = () => write($('relBtn'), $('relOut'),
  TANIT + "Rédige le résumé d'un relevé trimestriel d'exemple pour un citoyen, en 80 mots maximum, mots très simples, sans Markdown. Données : versé ce trimestre " + Math.round(cap.c/4) + " €, réparti selon les quatre compartiments ci-dessus. Explique en une phrase ce que finance chaque compartiment. N'invente aucune performance chiffrée : dis que le rendement réel sera indiqué sur le vrai relevé.", $('relSay'));

/* ---------- VOTE ---------- */
function buildOpts(id, labels){
  const cur = store.get(id) ?? '1';
  $(id).replaceChildren(...labels.map((lab,i) => { const l = mk('label','opt'); const r = document.createElement('input'); r.type = 'radio'; r.name = id; r.value = i; r.id = id + '_' + i; r.checked = String(i) === cur; l.append(r, mk('span','',lab)); return l; }));
}
function vote(){ const v = +$('vR').value; $('vA').textContent = v + ' %'; $('vB').textContent = (100-v) + ' %'; }
$('vR').oninput = vote;
if (store.get('v1')) { $('vR').value = store.get('v1'); $('vDone').hidden = false; }
const picked = id => (document.querySelector('input[name='+id+']:checked') || {}).value ?? '1';
$('vGo').onclick = () => { store.set('v1', $('vR').value); store.set('v2', picked('v2')); store.set('v3', picked('v3')); $('vDone').hidden = false; };
$('vExplain').onclick = () => write($('vExplain'), $('vOut'),
  TANIT + "Les citoyens votent sur trois choix : (1) la part entre transition écologique et industrie souveraine, (2) le secteur à renforcer en premier parmi énergie, transports, technologies critiques, batteries et hydrogène, défense, (3) le niveau de risque du fonds. Présente les enjeux de façon strictement neutre, sans recommander de choix, avec des mots très simples, sans Markdown, 150 mots maximum : pour chaque vote, ce qu'on gagne et ce qu'on risque. Ne cite aucun chiffre que tu ne peux pas justifier.");

/* ---------- AIDES ---------- */
let aides = EX.fr, profilReel = false;
const profil = () => ({revenu_net_mensuel:+$('pRev').value||0, loyer_mensuel:+$('pLoyer').value||0, age:+$('pAge').value||0, enfants_a_charge:+$('pEnf').value||0, vie:$('pSit').value, activite:$('pAct').value});
function renderAides(){
  const box = $('aidList'); box.replaceChildren(); let total = 0;
  aides.forEach(a => {
    const m = typeof a.montant_mensuel === 'number' ? a.montant_mensuel : null; if (m && a.eligibilite !== 'peu probable') total += m;
    const cls = a.eligibilite === 'probable' ? 'ok' : a.eligibilite === 'possible' ? 'warn' : '';
    const c = mk('div','card'), top = mk('div','row'); top.style.justifyContent = 'space-between';
    top.append(mk('h2','',String(a.aide || '')), mk('span','tag '+cls, t('elig')[a.eligibilite] || t('elig').possible));
    const amt = mk('div','big', m ? t('about') + ' ' + eur(m) + ' ' + t('permonth') : t('health')); amt.style.fontSize = '1.5rem';
    const b = mk('button','',t('prep')); b.onclick = () => dossier(a, b);
    c.append(top, amt, mk('p','',String(a.pourquoi || '')), mk('p','small muted', t('org') + ' ' + String(a.organisme || '')), b); box.append(c);
  });
  $('resTag').textContent = profilReel ? t('tag_ai') : t('tag_ex');
  $('homeTag').textContent = profilReel ? t('ex_you') : t('ex_camille');
  $('homeAides').textContent = t('about') + ' ' + eur(total);
}
$('doc').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  if (!consent().doc) { $('docMsg').textContent = t('doc_off'); e.target.value = ''; return; }
  if (!sample) { $('docMsg').textContent = t('no_ai'); return; }
  $('docMsg').textContent = t('reading');
  try {
    const d = await sample.json(
      "Tu lis la photo d'un document administratif français (avis d'imposition ou fiche de paie). Réponds uniquement en JSON : " +
      '{"revenu_net_mensuel": number|null, "enfants_a_charge": number|null, "vie": "seul"|"couple"|null, "lisible": boolean}. ' +
      "Pour un avis d'imposition, divise le revenu annuel déclaré par 12. Mets null si l'information n'est pas visible. N'invente rien.", {images:[f], cache:false, schema:'document'});
    if (!d || d.lisible === false) { $('docMsg').textContent = t('unread'); return; }
    if (typeof d.revenu_net_mensuel === 'number') { $('pRev').value = Math.round(d.revenu_net_mensuel); $('cRev').value = Math.min(8000, Math.max(800, Math.round(d.revenu_net_mensuel/50)*50)); capital(); }
    if (typeof d.enfants_a_charge === 'number') $('pEnf').value = d.enfants_a_charge;
    if (d.vie === 'seul' || d.vie === 'couple') $('pSit').value = d.vie;
    $('docMsg').textContent = t('read_ok');
  } catch (err) { $('docMsg').textContent = errCopy(err && err.code); }
  e.target.value = '';
};
$('findBtn').onclick = async () => {
  if (!aiOn()) { $('findMsg').textContent = t('ai_off'); return; }
  if (!sample) { $('findMsg').textContent = t('no_ai'); return; }
  const b = $('findBtn'); b.disabled = true; $('findMsg').textContent = t('searching');
  try {
    const r = await sample.json(
      "Tu es un conseiller en accès aux droits sociaux en France. Situation de la personne : " + JSON.stringify(profil()) +
      ". Estime son éligibilité à : prime d'activité, RSA, aide au logement (APL), complémentaire santé solidaire, chèque énergie, et minimum vieillesse (ASPA) si elle a 65 ans ou plus. " +
      'Réponds uniquement par un tableau JSON, sans les aides clairement exclues : [{"aide": string, "organisme": string, "eligibilite": "probable"|"possible"|"peu probable", "montant_mensuel": number|null, "pourquoi": string, "pieces": [string]}]. ' +
      "Les valeurs de « eligibilite » restent exactement ces mots français. « pourquoi » : une phrase très simple. « montant_mensuel » : ordre de grandeur prudent en euros, ou null. N'affirme jamais un droit : ce sont des estimations. Pour les champs aide, organisme, pourquoi et pieces : " + t('ai_lang'), {schema:'aides'});
    if (Array.isArray(r) && r.length) { aides = r.slice(0,8); profilReel = true; renderAides(); $('findMsg').textContent = t('found'); }
    else $('findMsg').textContent = t('none');
  } catch (err) { $('findMsg').textContent = errCopy(err && err.code); }
  b.disabled = false;
};
async function dossier(a, btn){
  $('dossier').hidden = false; $('dosDone').hidden = true; $('dosOk').hidden = false;
  $('dosTitle').textContent = t('dos_title') + ' ' + String(a.aide);
  const base = t('dos_pieces') + '\n' + (Array.isArray(a.pieces) ? a.pieces : []).map(p => '• ' + String(p)).join('\n');
  $('dosOut').textContent = base; $('dossier').scrollIntoView({behavior:'smooth'});
  if (!sample || !aiOn()) return;
  await write(btn, $('dosOut'),
    "Prépare, avec des mots très simples et sans Markdown, un dossier de demande pour l'aide « " + String(a.aide) + " » (" + String(a.organisme) + ") en France. Situation : " + JSON.stringify(profil()) +
    ". Structure : 1) Résumé de ma situation tel qu'il sera déclaré (4 lignes). 2) Pièces à réunir. 3) Les étapes, numérotées. 4) Ce qu'il faut vérifier avant de valider. Moins de 180 mots. N'invente aucune donnée personnelle.", $('dosSay'), 'default');
  if (!$('dosOut').textContent.trim()) $('dosOut').textContent = base;
}
$('dosOk').onclick = () => { $('dosDone').hidden = false; $('dosOk').hidden = true; addDossier($('dosTitle').textContent.replace(t('dos_title'),'').trim()); };

/* ---------- ASSISTANT ---------- */
const turns = []; let ctl = null;
function bubble(cls, text){ const d = mk('div','bubble '+cls, text); $('chat').append(d); return d; }
async function ask(q){
  q = (q || '').trim(); if (!q) return;
  if (!aiOn()) { $('aiMsg').textContent = t('ai_off'); return; }
  if (!sample) { $('aiMsg').textContent = t('no_ai'); return; }
  bubble('me', q); const out = bubble('ai', t('think')); $('q').value = '';
  turns.push({role:'user', content:q}); ctl = new AbortController();
  $('send').disabled = true; $('stop').hidden = false; $('aiMsg').textContent = '';
  const RULES = "Tu es l'assistant de Tanit Citoyen, un prototype étudiant non affilié à l'État. " + TANIT + "Tu aides des citoyens de tous âges à comprendre Tanit, leurs aides sociales et leurs impôts. Règles : phrases courtes, mots très simples, pas de Markdown, 110 mots maximum. Tu donnes des estimations et renvoies vers la CAF, l'Assurance maladie ou impots.gouv.fr pour confirmer. Tu ne donnes pas de conseil en investissement. Si tu ne sais pas, dis-le. " + t('ai_lang') + " Situation déclarée : " + JSON.stringify(profil());
  try {
    const { text } = await sample([{role:'user', content:RULES}, {role:'assistant', content:"OK."}, ...turns.slice(-8)], {cache:false, signal:ctl.signal, onText: ({text}) => { out.textContent = text; }});
    out.textContent = text; turns.push({role:'assistant', content:text});
    if (tts) { const b = mk('button','ghost sm',t('listen')); b.style.alignSelf = 'flex-start'; $('chat').append(b); say(b, () => text); }
  } catch (err) { turns.pop(); out.textContent = (err && err.text) || errCopy(err && err.code); }
  $('send').disabled = false; $('stop').hidden = true; out.scrollIntoView({behavior:'smooth', block:'nearest'});
}
$('send').onclick = () => ask($('q').value);
$('stop').onclick = () => ctl && ctl.abort();

/* ---------- DÉCIDEURS ---------- */
function etat(){
  const c = +$('eC').value; $('eCV').textContent = c + ' ' + t('bn');
  const vals = [10,20,30].map(n => fv(c, R_TANIT, n)), max = vals[2];
  $('eBars').replaceChildren(...[10,20,30].map((n,i) => { const l = mk('div','barline'); const tr = mk('div','track'), f = mk('div','fill'); f.style.width = vals[i]/max*100 + '%'; tr.append(f); l.append(mk('span','',t('et_in')(n)), mk('b','',Math.round(vals[i]) + ' ' + t('bn')), tr); return l; }));
  const ok = ['k1','k2','k3','k4'].every(k => $(k).checked);
  $('eTag').className = 'tag ' + (ok ? 'ok' : 'warn'); $('eTag').textContent = ok ? t('e_ok') : t('e_ko');
}
$('eC').oninput = etat; ['k1','k2','k3','k4'].forEach(k => $(k).onchange = etat);
$('eBtn').onclick = () => write($('eBtn'), $('eOut'),
  TANIT + "Tu es un agent d'analyse pour un décideur public. Paramètres testés : collecte de " + $('eC').value + " Md€ par an ; " +
  ['k1','k2','k3','k4'].map(k => L.fr[k] + " : " + ($(k).checked ? "oui" : "NON")).join(" ; ") +
  ". En 170 mots maximum, sans Markdown : 1) le risque de classement du fonds dans les administrations publiques au sens du SEC 2010 avec ces paramètres, 2) les deux points les plus fragiles (par exemple l'origine fiscale de la contribution, le contrôle public), 3) trois questions à poser à l'INSEE et à Eurostat. Ne conclus jamais que le montage est conforme : c'est une analyse préparatoire.", null, 'default');


/* ---------- compte, connexion, consentement ---------- */
const jget = k => { try { return JSON.parse(store.get(k) || 'null'); } catch { return null; } };
const jset = (k, v) => store.set(k, JSON.stringify(v));
const session = () => jget('session');
const consent = () => jget('consent') || {};
const aiOn = () => consent().ai !== false;
function gate(){ if (!lang) return 'lang'; if (!store.get('onb')) return 'intro'; if (!session()) return 'login'; if (!jget('consent')) return 'consent'; return null; }
const initials = n => (n || '?').split(/[\s.@_-]+/).filter(Boolean).slice(0,2).map(x => x[0].toUpperCase()).join('');
function renderAccountBits(){ const s = session(); if (s) $('acct').textContent = initials(s.name); $('acct').setAttribute('aria-label', s ? s.name : ''); }

let slide = 0;
const ICONS = ['<svg viewBox="0 0 24 24"><path d="M3 7h18v12H3z"/><path d="M3 10h18"/><path d="M16 15h2"/></svg>','<svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 14l2 2 4-4"/></svg>','<svg viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/></svg>'];
function renderIntro(){
  const d = t('intro')[slide]; $('introH').textContent = d[0]; $('introP').textContent = d[1];
  $('introArt').innerHTML = ICONS[slide];
  [...$('introDots').children].forEach((i,k) => i.classList.toggle('on', k === slide));
  $('introNext').textContent = slide < 2 ? t('next') : t('start');
}
function endIntro(){ store.set('onb','1'); route(); }
$('introNext').onclick = () => { if (slide < 2) { slide++; renderIntro(); } else endIntro(); };
$('introSkip').onclick = endIntro;

function signIn(name, method){ jset('session', {name, method, at: Date.now()}); location.hash = '#accueil'; route(); }
$('fcBtn').onclick = () => { $('fcBtn').disabled = true; $('lgMsg').textContent = t('lg_fc_wait'); setTimeout(() => { $('fcBtn').disabled = false; $('lgMsg').textContent = ''; signIn(t('demo_name'), 'fc'); }, 900); };
$('mailBtn').onclick = () => { const m = $('mail').value.trim(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) { $('lgMsg').textContent = t('lg_bad_mail'); return; } $('lgMsg').textContent = ''; $('codeBox').hidden = false; $('code').focus(); };
$('codeBtn').onclick = () => { if ($('code').value.trim() !== '123456') { $('lgMsg').textContent = t('lg_bad_code'); return; } $('lgMsg').textContent = ''; signIn($('mail').value.trim().split('@')[0], 'mail'); };
$('demoBtn').onclick = () => signIn(t('guest'), 'demo');

function consentRows(box, prefix, values){
  box.replaceChildren(...t('cs').map(([k, title, desc]) => {
    const row = mk('div','setting'), txt = mk('div'); txt.append(mk('b','',title), mk('p','small muted',desc));
    const sw = mk('label','switch'), inp = document.createElement('input'); inp.type = 'checkbox'; inp.id = prefix + k;
    inp.checked = k === 'base' ? true : values[k] !== false; inp.disabled = k === 'base';
    inp.setAttribute('aria-label', title); sw.append(inp, mk('span')); row.append(txt, sw); return row;
  }));
}
const readRows = prefix => ({ doc: $(prefix+'doc').checked, ai: $(prefix+'ai').checked, stats: $(prefix+'stats').checked, at: Date.now() });
function renderConsent(){ consentRows($('csList'), 'cs_', jget('consent') || {doc:true, ai:true, stats:false}); }
$('csAll').onclick = () => { jset('consent', {doc:true, ai:true, stats:true, at:Date.now()}); route(); };
$('csSave').onclick = () => { jset('consent', readRows('cs_')); route(); };

function addDossier(name){ const l = jget('dossiers') || []; l.unshift({name, at: Date.now(), step: 1}); jset('dossiers', l.slice(0,10)); }
const fmtDate = ts => new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'fr-FR', {day:'numeric', month:'long', hour:'2-digit', minute:'2-digit'}).format(ts);
function renderAccount(){
  const s = session() || {}; $('pAv').textContent = initials(s.name); $('pName').textContent = s.name || '';
  $('pMeta').textContent = t('since') + ' ' + ({fc:t('m_fc'), mail:t('m_mail'), demo:t('m_demo')}[s.method] || '');
  const l = jget('dossiers') || [];
  $('dosList').replaceChildren(...(l.length ? l.map(d => {
    const c = mk('div','card'); c.append(mk('h2','',d.name), mk('p','small muted',fmtDate(d.at)));
    const ol = mk('ol','timeline'); t('steps').forEach((st,i) => ol.append(mk('li', i <= d.step ? 'done' : '', st)));
    c.append(ol, mk('p','small muted',t('ac_sent_note'))); return c;
  }) : [mk('div','card empty', t('ac_dos_empty'))]));
  consentRows($('acCons'), 'ac_', consent());
  $('acCons').querySelectorAll('input').forEach(i => i.onchange = () => jset('consent', readRows('ac_')));
  const kept = t('kept'), keys = Object.keys(kept).filter(k => store.get(k));
  $('acData').textContent = keys.length ? keys.map(k => '• ' + kept[k]).join('\n') : t('nothing');
  $('wipeBox').hidden = true; $('wipeBtn').hidden = false;
  segs();
}
function segs(){
  const cur = {segLang: lang, segSize: document.documentElement.classList.contains('big') ? 'big' : ''};
  Object.entries(cur).forEach(([id, v]) => $(id).querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v))));
}
$('segLang').onclick = e => { const v = e.target.closest('button')?.dataset.v; if (!v) return; lang = v; store.set('lang', v); applyLang(); route(); };
$('segSize').onclick = e => { const b = e.target.closest('button'); if (!b) return; const on = b.dataset.v === 'big'; document.documentElement.classList.toggle('big', on); store.set('big', on ? '1' : ''); $('bigBtn').textContent = on ? t('bigOn') : t('bigOff'); segs(); };
// Thème : clair uniquement (fond blanc). On efface un éventuel ancien choix « sombre ».
function applyTheme(){ document.documentElement.removeAttribute('data-theme'); try { localStorage.removeItem('theme'); } catch {} }
$('wipeBtn').onclick = () => { $('wipeBox').hidden = false; $('wipeBtn').hidden = true; };
$('wipeNo').onclick = () => { $('wipeBox').hidden = true; $('wipeBtn').hidden = false; };
$('wipeYes').onclick = () => { ['lang','onb','session','consent','dossiers','v1','v2','v3','big','theme'].forEach(k => { try { localStorage.removeItem(k); } catch {} }); lang = null; slide = 0; document.documentElement.classList.remove('big'); applyTheme(); location.hash = ''; applyLang(); route(); };
$('logoutBtn').onclick = () => { try { localStorage.removeItem('session'); } catch {} location.hash = ''; route(); };
function renderPolicy(){ $('poBody').replaceChildren(...t('po').flatMap(([h, p]) => [mk('h2','',h), mk('p','',p)])); }
$('poBack').onclick = () => { if (history.length > 1) history.back(); else { location.hash = '#accueil'; } };

/* ---------- démarrage ---------- */
if (store.get('big')) document.documentElement.classList.add('big');
applyTheme(); applyLang(); route();
(async () => {
  // Avant : window.claude.use('sample') et ('tts'), qui ne marchaient que dans claude.ai.
  // Maintenant : notre serveur Node pour le texte, la voix du navigateur pour « Écouter ».
  tts = aiTts;
  if (await aiReady()) sample = aiSample;
  if (!sample) $('aiMsg').textContent = t('no_ai');
})();
