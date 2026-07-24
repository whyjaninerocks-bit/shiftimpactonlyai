import Link from "next/link";
import { notFound } from "next/navigation";
import { DataSourceSetupSection } from "@/app/components/DataSourceSetupSection";
import { getCampaign, getSignals } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const [campaign, signals] = await Promise.all([
      getCampaign(id),
      getSignals(),
    ]);

    return (
      <main className="app-shell">
        <header className="topbar">
          <div>
            <Link className="back-link" href="/">
              Campaigns
            </Link>
            <h1>{campaign.name}</h1>
          </div>
          <span className="status-pill">{campaign.status}</span>
        </header>

        <section className="section campaign-info">
          <div>
            <p className="eyebrow">Campaign Info</p>
            <h2>{campaign.brand_name}</h2>
          </div>
          <dl>
            <div>
              <dt>Client</dt>
              <dd>{campaign.client_name}</dd>
            </div>
            <div>
              <dt>Campaign</dt>
              <dd>{campaign.name}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{campaign.status}</dd>
            </div>
          </dl>
        </section>

        <DataSourceSetupSection campaignId={campaign.id} signals={signals} />

        <section className="section brief-placeholder">
          <p className="eyebrow">FRAME Brief</p>
          <h2>Brief workspace</h2>
          <p>Reserved for the next brief-generation sprint.</p>
        </section>
      </main>
    );
  } catch {
    notFound();
  }
}
