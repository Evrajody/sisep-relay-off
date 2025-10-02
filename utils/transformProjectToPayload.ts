/**
 * Transforme un projet récupéré de l'API en payload pour modification
 * Convertit la structure de données de réponse en structure attendue par le formulaire
 *
 * @param project - Le projet à transformer (format API)
 * @returns Le payload formaté pour le formulaire de modification
 */
export function transformProjectToPayload(project: any): any {
  if (!project) {
    return null;
  }

  return {
    // Informations de base
    coverImageId: project.coverImageId || null,
    title: project.title || '',
    typeId: project.typeId || null,
    status: project.status || null,
    startDate: project.startDate || null,
    endDate: project.endDate || null,
    description: project.description || '',

    // Objectifs et résultats
    objective: project.objective || { goal: '' },
    expectedResults: project.expectedResults || { result: '' },
    lessonsLearned: project.lessonsLearned || { lesson: '' },

    // Liens d'information
    infoLinks: project.infoLinks || { infoLinks_website: '' },

    // Indicateurs - transformation du format API vers le format formulaire
    indicators: (project.indicators || []).map((indicator: any) => ({
      // Si l'indicateur a un ID, c'est un indicateur existant
      indicatorId: indicator.id ? {
        id: indicator.id,
        nom: indicator.name || indicator.indicatorName,
      } : null,

      // Données de l'indicateur
      indicatorName: indicator.name || indicator.indicatorName || '',
      baselineYear: indicator.baselineYear || null,
      baselineValue: indicator.baselineValue || '',
      targetYear: indicator.targetYear || null,
      targetValue: indicator.targetValue || '',
      latestYear: indicator.latestYear || null,
      latestValue: indicator.latestValue || '',
      methodologyReference: indicator.methodologyReference || { url: '' },
    })),

    // Actions
    actions: (project.actions || []).map((action: any) => ({
      type: action.type || '',
      status: action.status || '',
      description: action.description || '',
    })),

    // Partenaires
    partners: (project.partners || []).map((partner: any) => ({
      name: partner.name || '',
      type: partner.type || '',
      otherData: partner.otherData || { role: '', partnerImage: null },
    })),

    // Cibles
    targets: (project.targets || []).map((target: any) => ({
      name: target.name || '',
      description: target.description || '',
    })),

    // Fichiers associés
    files: (project.files || []).map((file: any) => ({
      fileTypeId: file.fileTypeId || null,
      fileId: file.fileId || null,
    })),

    // Finances - transformation du premier élément du tableau en objet
    finances: project.finances && project.finances.length > 0
      ? [{
          reportingYear: project.finances[0].reportingYear || null,
          instrumentType: project.finances[0].instrumentType || '',
          amountCommitedCfa: project.finances[0].amountCommitedCfa?.toString() || '',
          amountDisbursedCfa: project.finances[0].amountDisbursedCfa?.toString() || '',
          currency: project.finances[0].currency || null,
          exchangeRateUsed: project.finances[0].exchangeRateUsed?.toString() || '',
          fundingSource: project.finances[0].fundingSource || {
            donor: '',
            program: ''
          },
        }]
      : [{
          reportingYear: null,
          instrumentType: '',
          amountCommitedCfa: '',
          amountDisbursedCfa: '',
          currency: null,
          exchangeRateUsed: '',
          fundingSource: { donor: '', program: '' },
        }],

    // Localisation
    location: {
      region: project.location?.region || null,
      city: project.location?.city || null,
      location: project.location?.location ? {
        type: project.location.location.type || 'point',
        coordinates: project.location.location.coordinates || null,
      } : null,
    },

    // Vérifications
    verifications: (project.verifications || []).map((verification: any) => ({
      verificationLevel: verification.verificationLevel || null,
      verificationDate: verification.verificationDate || null,
      verifier: verification.verifier || {
        name: '',
        organization: null
      },
      verificationReportReference: verification.verificationReportReference || null,
    })),
  };
}

/**
 * Transforme un payload de formulaire en format attendu par l'API pour la mise à jour
 * Inverse de transformProjectToPayload
 *
 * @param formData - Les données du formulaire
 * @returns Le payload formaté pour l'API
 */
export function transformPayloadToAPI(formData: any): any {
  if (!formData) {
    return null;
  }

  const payload: any = {
    coverImageId: formData.coverImageId,
    title: formData.title,
    typeId: formData.typeId,
    status: formData.status,
    startDate: formData.startDate,
    endDate: formData.endDate,
    description: formData.description,
    objective: formData.objective,
    expectedResults: formData.expectedResults,
    lessonsLearned: formData.lessonsLearned,
    infoLinks: formData.infoLinks,
  };

  // Transformation des indicateurs
  if (formData.indicators && formData.indicators.length > 0) {
    payload.indicators = formData.indicators.map((indicator: any) => {
      const transformed: any = {
        indicatorName: indicator.indicatorName,
        baselineYear: indicator.baselineYear,
        baselineValue: indicator.baselineValue,
        targetYear: indicator.targetYear,
        targetValue: indicator.targetValue,
        latestYear: indicator.latestYear,
        latestValue: indicator.latestValue,
        methodologyReference: indicator.methodologyReference,
      };

      // Si c'est un indicateur existant, ajouter l'ID
      if (indicator.indicatorId?.id) {
        transformed.id = indicator.indicatorId.id;
      }

      return transformed;
    });
  }

  // Ajout des autres champs
  payload.actions = formData.actions || [];
  payload.partners = formData.partners || [];
  payload.targets = formData.targets || [];
  payload.files = formData.files || [];

  // Transformation de location avec coordonnées
  if (formData.location) {
    payload.location = {
      region: formData.location.region,
      city: formData.location.city,
    };

    // Ajout des coordonnées si présentes
    if (formData.location.location?.coordinates) {
      payload.location.location = {
        type: formData.location.location.type || 'point',
        coordinates: formData.location.location.coordinates,
      };
    }
  }

  // Transformation des finances (du tableau au format attendu)
  if (formData.finances && formData.finances.length > 0) {
    payload.finances = formData.finances.map((finance: any) => ({
      reportingYear: finance.reportingYear,
      instrumentType: finance.instrumentType,
      amountCommitedCfa: parseFloat(finance.amountCommitedCfa) || 0,
      amountDisbursedCfa: parseFloat(finance.amountDisbursedCfa) || 0,
      currency: finance.currency,
      exchangeRateUsed: parseFloat(finance.exchangeRateUsed) || 0,
      fundingSource: finance.fundingSource,
    }));
  }

  payload.verifications = formData.verifications || [];

  return payload;
}

/**
 * Nettoie le payload en supprimant les champs vides ou null
 *
 * @param payload - Le payload à nettoyer
 * @returns Le payload nettoyé
 */
export function cleanPayload(payload: any): any {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload
      .map(item => cleanPayload(item))
      .filter(item => item !== null && item !== undefined);
  }

  const cleaned: any = {};

  for (const [key, value] of Object.entries(payload)) {
    // Garder les valeurs 0 et false
    if (value === null || value === undefined || value === '') {
      continue;
    }

    if (typeof value === 'object') {
      const cleanedValue = cleanPayload(value);

      // Ne pas ajouter les objets vides
      if (Array.isArray(cleanedValue) && cleanedValue.length === 0) {
        continue;
      }

      if (Object.keys(cleanedValue).length > 0) {
        cleaned[key] = cleanedValue;
      }
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}
