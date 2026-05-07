import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Eye, Database, UserCheck, FileCheck } from 'lucide-react'

export function SecurityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Data Security & Privacy</h1>
          <p className="text-muted-foreground">Our commitment to protecting your data and privacy</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Shield className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Enterprise-Grade Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All data is encrypted using industry-standard AES-256 encryption both in transit and at rest.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Secure Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Multi-factor authentication and secure password policies protect your account from unauthorized access.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Eye className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Privacy Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Granular privacy settings allow you to control who can see your information and contact you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Database className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Regular backups and disaster recovery procedures ensure your data is always safe and recoverable.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <UserCheck className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>User Consent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We never share your data without explicit consent and provide clear opt-in/opt-out mechanisms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileCheck className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Full compliance with GDPR, CCPA, and other data protection regulations to protect your rights.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Role-Based Access Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our platform implements strict role-based access control to ensure users only have access to appropriate data and features.
            </p>
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-2 font-semibold">Alumni Members</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Access to their own profile and directory</li>
                  <li>• Ability to connect with other verified alumni</li>
                  <li>• Participate in events and mentorship programs</li>
                  <li>• Control visibility of personal information</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-2 font-semibold">Administrators</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Approve or reject new alumni registrations</li>
                  <li>• Manage platform content and events</li>
                  <li>• Access analytics and engagement metrics</li>
                  <li>• Moderate communications and ensure policy compliance</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-2 font-semibold">Mentors</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Additional visibility to mentee profiles</li>
                  <li>• Access to scheduling and communication tools</li>
                  <li>• View engagement metrics for their sessions</li>
                  <li>• Manage availability and expertise areas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data We Collect</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              We are transparent about what data we collect and how it's used. All data collection is for the purpose of providing and improving our services.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span><strong>Profile Information:</strong> Name, graduation year, education history, work experience</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span><strong>Contact Details:</strong> Email address, phone number (optional), professional social media links</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span><strong>Engagement Data:</strong> Event participation, mentorship sessions, communication activity</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span><strong>Technical Data:</strong> Login history, IP addresses (for security purposes only)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              You have complete control over your data. Here are your rights:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-semibold">Right to Access</h4>
                <p className="text-sm text-muted-foreground">
                  Request a copy of all personal data we hold about you at any time.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-semibold">Right to Correction</h4>
                <p className="text-sm text-muted-foreground">
                  Update or correct any inaccurate information in your profile.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-semibold">Right to Deletion</h4>
                <p className="text-sm text-muted-foreground">
                  Request complete deletion of your account and associated data.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-semibold">Right to Portability</h4>
                <p className="text-sm text-muted-foreground">
                  Export your data in a machine-readable format for transfer.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
