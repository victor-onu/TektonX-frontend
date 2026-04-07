import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import partnershipService from '@/services/partnershipService'
import { format } from 'date-fns'

function typeBadge(partnershipType: string) {
  switch (partnershipType) {
    case 'sponsor':
      return (
        <Badge className="bg-tekton-purple-bright/20 text-tekton-purple-bright border-tekton-purple-bright/40 border">
          Sponsor
        </Badge>
      )
    case 'hiring':
      return (
        <Badge className="bg-tekton-blue/20 text-tekton-blue border-tekton-blue/40 border">
          Hiring Partner
        </Badge>
      )
    case 'both':
      return (
        <Badge className="bg-tekton-teal/20 text-tekton-teal border-tekton-teal/40 border">
          Both
        </Badge>
      )
    default:
      return <Badge variant="outline" className="text-white/50">{partnershipType}</Badge>
  }
}

export default function AdminPartnerships() {
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['partnerships'],
    queryFn: partnershipService.getAll,
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl text-white">PARTNERSHIP INQUIRIES</h2>
        <p className="mt-1 text-sm text-white/50">
          Companies and organizations interested in partnering with TektonX.
        </p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col divide-y divide-white/5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
                <div className="h-5 w-20 rounded-full bg-white/10 animate-pulse" />
                <div className="h-4 w-24 rounded bg-white/10 animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-white/40">No partnership inquiries yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/50 text-xs uppercase tracking-wider">Company</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider">Contact</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider">Email</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id} className="border-white/5 hover:bg-white/[0.03]">
                  <TableCell className="font-medium text-white">{inquiry.companyName}</TableCell>
                  <TableCell className="text-white/70">{inquiry.contactName}</TableCell>
                  <TableCell className="text-white/70">{inquiry.email}</TableCell>
                  <TableCell>{typeBadge(inquiry.partnershipType)}</TableCell>
                  <TableCell className="text-white/50 text-sm">
                    {format(new Date(inquiry.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
