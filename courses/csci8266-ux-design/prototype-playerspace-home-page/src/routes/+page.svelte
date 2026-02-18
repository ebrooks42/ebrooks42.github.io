<script lang="ts">
	interface Event {
		id: number;
		date: string;
		dayOfWeek: string;
		time: string;
		homeTeam: string;
		homeTeamCoach: string;
		awayTeam: string;
		awayTeamCoach: string;
		location: string;
		address: string;
		city: string;
		zipCode: string;
		locationEventDirectionsLink: string;
	}

	const upcomingEvents: Event[] = [
		{
			id: 1,
			date: '12/13/2025',
			dayOfWeek: 'Saturday',
			time: '12:45 PM',
			homeTeam: 'Team Jaguar',
			homeTeamCoach: 'Evan Brooks',
			awayTeam: 'Team Puma',
			awayTeamCoach: 'John Smith',
			location: 'Maple Street YMCA Court 1',
			address: '7502 Maple Street',
			city: 'Omaha, NE',
			zipCode: '68134',
			locationEventDirectionsLink: 'https://maps.app.goo.gl/CHS9zrDjg7RqWepq7'
		}
	];
</script>

<div class="flex justify-center">
	<div class="w-full max-w-2xl space-y-6">
		<!-- Upcoming Events Section -->
		<div>
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Upcoming Events</h2>

			<!-- Events List -->
			<div class="space-y-4">
				{#each upcomingEvents as event (event.id)}
					<div class="overflow-hidden rounded-lg bg-white shadow">
						<!-- Event Header with Date and Time -->
						<div
							class="border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100 px-6 py-4"
						>
							<div class="flex items-start justify-between">
								<div>
									<h3 class="text-lg font-semibold text-gray-900">
										{event.dayOfWeek}
										{event.date}
									</h3>
								</div>
								<div class="text-right">
									<div class="text-gray-600">
										{event.time} to 1:45 PM
									</div>
								</div>
							</div>
						</div>

						<!-- Event Details -->
						<div class="space-y-4 px-6 py-4">
							<!-- Teams and Coaches -->
							<div>
								<h4 class="text-sm font-semibold text-gray-700">
									{event.homeTeam}
									<span class="mx-2 text-gray-500">vs</span>
									{event.awayTeam}
								</h4>
							</div>

							<!-- Location Section -->
							<div class="border-t border-gray-200 pt-4">
								<p class="mb-2 text-sm font-semibold text-gray-700">Location:</p>
								<a
									href={event.locationEventDirectionsLink}
									target="_blank"
									rel="noopener noreferrer"
									class="text-sm text-blue-600 hover:text-blue-800 hover:underline"
								>
									{event.location} <br />
									{event.address} <br />
									{event.city}, {event.zipCode}
								</a>
							</div>

							<!-- Home and Away Teams Information -->
							<div class="border-t border-gray-200 pt-4">
								<p class="mb-2 text-sm font-semibold text-gray-700">Home and Away Teams:</p>
								<ul class="list-disc space-y-2 pl-5 text-sm text-gray-700">
									<li>
										<strong>Home team ({event.homeTeam})</strong> should wear their
										<strong class="text-black">BLACK</strong> jerseys.
									</li>
									<li>
										<strong>Away team ({event.awayTeam})</strong> should wear their
										<strong class="text-gray-400">GRAY</strong> jerseys.
									</li>
								</ul>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
