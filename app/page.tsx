import Link from "next/link";
import { getCampaigns } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const campaigns = await getCampaigns();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">ShiftImpact OS</p>
          <h1>Campaigns</h1>
        </div>
        <span className="status-pill">Demo access</span>
      </header>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Active setup queue</p>
            <h2>Select a campaign</h2>
          </div>
          <span className="count-pill">{campaigns.length} campaigns</span>
        </div>

        <div className="campaign-grid">
          {campaigns.map((campaign) => (
            <Link
              className="campaign-card"
              href={`/campaigns/${campaign.id}`}
              key={campaign.id}
            >
              <span>{campaign.status}</span>
              <h3>{campaign.name}</h3>
              <p>{campaign.client_name}</p>
              <strong>{campaign.brand_name}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
