interface CompanyAddress {
    street?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    mapsUrl?: string;
}

interface CompanyContact {
    email?: string;
    phone?: string;
}

interface CompanyRegistration {
    kvk?: string;
    btw?: string;
    founded?: string;
}

interface CompanySocials {
    facebook?: string;
    instagram?: string;
    x?: string;
    linkedin?: string;
}

interface Company {
    legalName?: string;
    address?: CompanyAddress;
    contact?: CompanyContact;
    registration?: CompanyRegistration;
    socials?: CompanySocials;
}

export type { CompanyAddress, CompanyContact, CompanyRegistration, CompanySocials, Company };